# from fasthtml.common import FastHTML, serve
from fasthtml.common import *
from transformers import DonutProcessor, VisionEncoderDecoderModel
import torch
import re
from PIL import Image
import io
import base64
from io import BytesIO
from donut import DonutModel

processor = DonutProcessor.from_pretrained("naver-clova-ix/donut-base-finetuned-docvqa")
model = VisionEncoderDecoderModel.from_pretrained("naver-clova-ix/donut-base-finetuned-docvqa")

device = "cuda" if torch.cuda.is_available() else "cpu"
# OS X Specific, if you have an m chip and want to use mps (much faster)
device = "mps" if torch.backends.mps.is_available() else device
if not torch.backends.mps.is_available():
    if not torch.backends.mps.is_built():
        print("MPS not available because the current PyTorch install was not "
              "built with MPS enabled.")
    else:
        print("MPS not available because the current MacOS version is not 12.3+ "
              "and/or you do not have an MPS-enabled device on this machine.")

model.to(device)

model.eval()

app = FastHTML(
    static_path='public',
    hdrs=(
        picolink,
        Link(rel='stylesheet', href='assets/style.css', type='text/css')
    )
)


@app.get("/{fname:path}.{ext:static}")
async def get(fname: str, ext: str):
    print(f"Serving {fname}.{ext}")
    return FileResponse(f'public/{fname}.{ext}')


@app.get("/")
def home():
    return Main(
        Div(
            H1("Extract Information From Image"),
            P(f"Running on {device}"),
            Fieldset(
                Label("Select the type of report",
                      Select(Option("", selected=True, disabled=True), Option("Covid", value="covid"),
                             Option("Pertussis", value="pertussis"), hx_trigger="change", hx_target="#form-covid",
                             hx_get="questions", name="form_type"))
            ),
            Div(id="form-covid"),

            Div(id="results"),
        ),
        cls="container",
        id="formContent"
    )


questionDict = {
    "covid": ["What is the patient's age?", "What is the patient's gender?",
              "Is the test result positive or negative?", "what is the patient's postal code?"],
    "pertussis": ["Who is the physician?", "What is the patient's date of birth?"]
}


@app.get("/questions")
def questions(form_type: str = None):
    _questions = questionDict[form_type]
    return Form(*map(lambda q: Input(type="hidden", name="question", value=q, disabled=False), _questions),
                Ul(*map(lambda q: Li(q), _questions)),
                Label("Upload a report image", Input(type="file", name="file")), Button("Submit"),
                Div("Processing Image...", id="loading", cls="htmx-indicator", aria_busy="true"),
                enctype="multipart/form-data", hx_target="#formContent", hx_post="/extract", hx_indicator="#loading")


@app.post("/extract")
async def extract(file: UploadFile, question: List[str]):
    # source_image_np = np.frombuffer(await file.read(), np.uint8)
    input_img = Image.open(io.BytesIO(file.file.read()))
    buffered = BytesIO()
    input_img.save(buffered, format="JPEG")
    image_base64 = base64.b64encode(buffered.getvalue()).decode("ascii")
    pixel_values = processor(input_img, return_tensors="pt").pixel_values
    # remove first task start token

    answers = []
    for q in question:
        answer = answerQuestion(pixel_values, q)
        answers.append(answer)

    return Div(
        H1("Extract Information From Image"),
        Img(src=f"data:image/png;base64,{image_base64}", height="50%"),
        *map(lambda answer: P(f"{answer['question']}: {answer['answer']}"), answers)
    )


def answerQuestion(pixel_values, question: str):
    task_prompt = "<s_docvqa><s_question>{user_input}</s_question><s_answer>"
    user_prompt = task_prompt.replace("{user_input}", question)
    decoder_input_ids = processor.tokenizer(user_prompt, add_special_tokens=False, return_tensors="pt").input_ids

    outputs = model.generate(
        pixel_values.to(device),
        decoder_input_ids=decoder_input_ids.to(device),
        max_length=model.decoder.config.max_position_embeddings,
        early_stopping=True,
        pad_token_id=processor.tokenizer.pad_token_id,
        eos_token_id=processor.tokenizer.eos_token_id,
        use_cache=True,
        num_beams=1,
        bad_words_ids=[[processor.tokenizer.unk_token_id]],
        return_dict_in_generate=True,
    )

    sequence = processor.batch_decode(outputs.sequences)[0]
    sequence = sequence.replace(processor.tokenizer.eos_token, "").replace(processor.tokenizer.pad_token, "")
    sequence = re.sub(r"<.*?>", "", sequence, count=1).strip()
    return processor.token2json(sequence)


def main():
    serve()


if __name__ == "__main__":
    main()
