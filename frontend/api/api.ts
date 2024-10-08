import { ImageToTextArgs, ImageToTextResponse } from "./types/types";

export const ImageToText = async (args: ImageToTextArgs): Promise<ImageToTextResponse | null> => {

    const { sourceImage, templateImage, fieldNames } = args;
    const form = new URLSearchParams({
        source_image: sourceImage,
        segmentation_template: templateImage,
        labels: JSON.stringify(fieldNames),
      });

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/"
    const imageToTextURL = `${apiUrl}image_to_text/`
    try {
        const response = await fetch(imageToTextURL, {
            "method": "POST",
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: form
          })
          return  await response.json() as ImageToTextResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
    
}
