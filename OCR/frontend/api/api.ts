import { Page } from "../src/contexts/FilesContext";
import { ImageToTextResponse } from "./types/types";

export const AddFormData = async (args: Page): Promise<ImageToTextResponse | null> => {

    const { sourceImage, templateImage, fieldNames } = args;
    const form = new FormData();
    form.append("source_image", sourceImage);
    form.append("segmentation_template", templateImage);
    form.append("labels", JSON.stringify(fieldNames));
    form.append("", "");
    console.log(args)
    try {
        const response = await fetch("http://localhost:8000/image_to_text/", {
            "method": "POST",
            body: form
          })
          return  await response.json() as ImageToTextResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
    
}
