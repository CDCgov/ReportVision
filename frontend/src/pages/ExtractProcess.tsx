import { useNavigate } from "react-router-dom";
import ExtractDataHeader from "../components/ExtractDataHeader";
import { Divider } from "../components/Divider";
import { ExtractStepper } from "../components/ExtractStepper";
import { ExtractStep } from "../utils/constants";
import LoadingWrapper from "../components/LoadingWrapper";
import { ImageToText } from "../../api/api"
import { useEffect, useState } from "react";
import { FileType, useFiles } from "../contexts/FilesContext";
import { ImageToTextResponse, Submission } from "../../api/types/types";
import * as pdfjsLib from "pdfjs-dist";
import { MultiImageAnnotator } from "../components/ImageAnnotator";


interface IResults {
  [key: string]: {
    text: string;
    confidence: number;
  };
}



const ExtractProcess = () => {
  const navigate = useNavigate();
  const { files } = useFiles();
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async () => {
    const templates: FileType[] = JSON.parse(localStorage.getItem("templates") || "[]");    
    // Check if templates exist
    if (templates.length === 0) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      // Map through each template and page to create a promise for each query
      const queries = templates.map(template => 
        template.pages.map((page) =>  ({
          fieldNames: page.fieldNames,
          sourceImage: page.sourceImage.image,
          templateImage: page.templateImage,
        })).map((args) => ImageToText(args))).flat();
    
      const responses: (ImageToTextResponse | null)[] = await Promise.all(queries);
  

      const results: IResults = {}

      responses.forEach((response) => {
        if (response) {
          Object.keys(response).forEach(key => {
            results[key] = {
              text: response[key][0],
              confidence: response[key][1],
            };
          });
        }
      })

      const transformedResponses: Submission = {
        template_name: templates[0].name,
        template_image: templates[0].pages[0].templateImage,
        file_name: 'image name',
        file_image: templates[0].pages[0].sourceImage.image,
        results,
      }
              
      localStorage.setItem("submission", JSON.stringify(transformedResponses));
    
      // Update loading state and navigate
      setIsLoading(false);
      navigate("/extract/review");
      
    } catch (error) {
      console.error("Error processing templates:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const pdfFile = files[0]
    if (!(pdfFile instanceof File)) {
      console.error("pdfFile is not a valid File object");
      return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const convertPdfToImages = async (file: File) => {
      const images: Array<string> = [];
      const data = URL.createObjectURL(file);

      const pdf = await pdfjsLib.getDocument(data).promise;
      const canvas = document.createElement("canvas");
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 1 });
        const context = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport })
          .promise;
        images.push(canvas.toDataURL());
      }
      canvas.remove();
      URL.revokeObjectURL(data);
      return images;
    };

    convertPdfToImages(pdfFile).then((imgs) => {
      setImages(imgs);
      localStorage.setItem("images", JSON.stringify(imgs));
    });
  }, [files]);

  return (
    <LoadingWrapper isLoading={isLoading}>
      <div className="display-flex flex-column flex-justify-start center width-full height-full padding-1 padding-top-2">
        <ExtractDataHeader
          onBack={() => navigate("extract/upload")}
          onSubmit={handleSubmit}
          onExit={() => navigate("/")}
          isUploadComplete={true}
        />
        <Divider margin="0px" />
        <div className="display-flex flex-justify-center padding-top-4">
          <ExtractStepper currentStep={ExtractStep.Extract} />
        </div>
        <Divider margin="0px" /> 
        <div className="display-flex flex-align-center flex-justify-center width-full height-full">
          <MultiImageAnnotator images={images} categories={[]} />
        </div>
      </div>
      </LoadingWrapper>

  );
};

export default ExtractProcess;
