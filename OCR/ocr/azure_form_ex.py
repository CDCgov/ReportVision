from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv
import os
import json


load_dotenv()


endpoint = os.getenv('FORM_RECOGNIZER_ENDPOINT')
key = os.getenv('FORM_RECOGNIZER_KEY')
file_path = os.getenv('FORM_RECOGNIZER_FILE_PATH')



client = DocumentAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))



try:
    with open(file_path, "rb") as f:
        poller = client.begin_analyze_document("prebuilt-document", document=f)
        result = poller.result()
except Exception as e:
    print(f"An error occurred: {e}")
else:
    with open('output.json', 'w') as json_file:
        for idx, style in enumerate(result.styles):
            if style.is_handwritten:
                print(f"Document contains handwritten content: {style.confidence}")

        for page in result.pages:
            print(f"Page number: {page.page_number} has {len(page.lines)} lines and {len(page.words)} words.")
            lines = page.lines[:] 
            lines_content = [line.content for line in lines]
            kv_pairs = {}
            for line in lines_content:
                if ':' in line:
                    key, value = line.split(':', 1)
                    kv_pairs[key.strip()] = value.strip()
            json.dump(kv_pairs, json_file, indent=4)

