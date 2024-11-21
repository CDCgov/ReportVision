import { useNavigate } from "react-router-dom";
import ExtractDataHeader from "../components/ExtractDataHeader";
import { Divider } from "../components/Divider";
import { ExtractStepper } from "../components/ExtractStepper";
import { ExtractStep } from "../utils/constants";
import LoadingWrapper from "../components/LoadingWrapper";
import { ImageToText } from "../../api/api"
import { useCallback, useEffect, useState } from "react";
import { Field, FileType, useFiles } from "../contexts/FilesContext";
import { ImageToTextResponse, Submission } from "../../api/types/types";
import * as pdfjsLib from "pdfjs-dist";
import { MultiImageAnnotator } from "../components/ImageAnnotator";
import { convertPdfToImages } from "../utils/utils";


interface IResults {
  [key: string]: {
    text: string;
    confidence: number;
  };
}

interface PDF {
  file: string;
  images: string[];
}



const ExtractProcess = () => {
  const navigate = useNavigate();
  const { files, selectedTemplates } = useFiles();
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = useCallback(async () => {
    const templates: FileType[] = JSON.parse(localStorage.getItem("templates") || "[]");   
    const pdfs: PDF[] = JSON.parse(localStorage.getItem("extracted_images_uploaded") || "[]"); 
    // Check if templates exist
    if (templates.length === 0 && pdfs.length === 0) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const newQueries = pdfs.map((pdf) => {
        return pdf.images.map((page, index) => {
          const selectedTemplateName = selectedTemplates.find((temp) => temp.fileName === pdf.file)?.templateName;
          return {
            pdfName: pdf.file,
            fieldNames: templates.find((template) => template.name === selectedTemplateName)?.pages[index].fieldNames as Field[],
            sourceImage: page,
            templateImage: templates.find((template) => template.name === selectedTemplateName)?.pages[index].templateImage as string,
          }
        })
      }).map((perBatch) => perBatch.map(async(args) => ({name: args.pdfName, resp: await ImageToText({
        sourceImage: args.sourceImage,
        templateImage: args.templateImage,
        fieldNames: args.fieldNames
      })}))).flat();
      const new_responses = await Promise.all(newQueries.map(async (query) => ({name: (await query).name, resp:  (await query).resp})));
      const arrResults: {[key: string]: IResults} = {}

      new_responses.forEach((response) => {
        if(response.name in arrResults) {
          Object.keys(response.resp as ImageToTextResponse).forEach(key => {
            arrResults[response.name][key] = {
              text: response.resp ? response.resp[key][0] : '',
              confidence: response.resp ? response.resp[key][1] : 0,
            };
          });
        } else {
          arrResults[response.name] = {}
          Object.keys(response.resp as ImageToTextResponse).forEach(key => {
            arrResults[response.name][key] = {
              text: response.resp ? response.resp[key][0] : '',
              confidence: response.resp ? response.resp[key][1] : 0,
            };
          });
        }
      })

      const arrTransformedResponses: Submission[] = Object.keys(arrResults).map((key) => {

        const transformedResponses: Submission = {
          template_name: templates[0].name,
          template_image: templates[0].pages[0].templateImage,
          file_name: key,
          file_image: pdfs.find((pdf) => pdf.file === key)?.images[0] as string,
          results: arrResults[key],
        }
        return transformedResponses
      });
              
      localStorage.setItem("arr_submissions", JSON.stringify(arrTransformedResponses));
    
      // Update loading state and navigate
      setIsLoading(false);
      navigate("/extract/review");
      
    } catch (error) {
      console.error("Error processing templates:", error);
      setIsLoading(false);
      navigate("/extract/upload");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  useEffect(() => {
    const pdfFile = files[0]
    if (!(pdfFile instanceof File)) {
      console.error("pdfFile is not a valid File object");
      return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    convertPdfToImages(pdfFile, pdfjsLib)
    .then((imgs) => {
      setImages(imgs);
      localStorage.setItem("images", JSON.stringify(imgs));
    })
    .finally(() => handleSubmit())
  }, [files, handleSubmit]);

  return (
    <LoadingWrapper isLoading={isLoading} title="Extracting your data" subtitle="This process could take up to 10-15 seconds.">
      <div className="display-flex flex-column flex-justify-start center width-full height-full padding-top-2">
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
