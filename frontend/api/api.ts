import {
  ImageToTextArgs,
  ImageToTextResponse,
  AlignImageArgs,
  AlignImageResponse,
} from "./types/types";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/";
const middlewareURL =  import.meta.env.MIDDLEWARE_API_URL || "http://localhost:8000/";

export const AlignImage = async (
  args: AlignImageArgs,
): Promise<AlignImageResponse> => {
  const { sourceImage, templateImage } = args;
  const form = new URLSearchParams({
    source_image: sourceImage,
    segmentation_template: templateImage,
  });

  const alignImageURL = `${apiUrl}image_alignment/`;
  try {
    const response = await fetch(alignImageURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    return (await response.json()) as AlignImageResponse;
  } catch (error) {
    console.error(error);
    return { result: sourceImage };
  }
};

export const ImageToText = async (
  args: ImageToTextArgs,
): Promise<ImageToTextResponse | null> => {
  const { sourceImage, templateImage, fieldNames } = args;
  const aligned_result = await AlignImage({ sourceImage, templateImage });
  const form = new URLSearchParams({
    source_image: aligned_result["result"],
    segmentation_template: templateImage,
    labels: JSON.stringify(fieldNames),
  });

  const imageToTextURL = `${middlewareURL}/api/image_file_to_text/`;
  try {
    const response = await fetch(imageToTextURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    return (await response.json()) as ImageToTextResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
};
