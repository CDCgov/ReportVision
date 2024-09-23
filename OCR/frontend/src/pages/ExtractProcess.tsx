import { useNavigate } from "react-router-dom";
import ExtractDataHeader from "../components/ExtractDataHeader";
import { Divider } from "../components/Divider";
import { ExtractStepper } from "../components/ExtractStepper";
import { ExtractStep } from "../utils/constants";
import LoadingWrapper from "../components/LoadingWrapper";
import { AddFormData } from "../../api/api"
import { useState } from "react";
import { FileType } from "../contexts/FilesContext";
import { ImageToTextResponse, Submission } from "../../api/types/types";

interface IResults {
  [key: string]: {
    text: string;
    confidence: number;
  };
}



const ExtractProcess = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async () => {
    const templates: FileType[] = JSON.parse(localStorage.getItem("templates") || "[]");    
    // Check if templates exist
    if (templates.length === 0) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Map through each template and page to create a promise for each query
      const queries = templates.map(template => 
        template.pages.map(page => AddFormData(page))
      ).flat(); // Flatten the array if you have nested pages
    
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
        file_image: templates[0].pages[0].sourceImage,
        results,
      }
        
      
      
      localStorage.setItem("extractedData", JSON.stringify(transformedResponses));
    
      // Update loading state and navigate
      setIsLoading(false);
      navigate("/");
      
    } catch (error) {
      console.error("Error processing templates:", error);
      setIsLoading(false);
    }
  }

  return (
    <LoadingWrapper isLoading={isLoading}>
      <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2">
        <ExtractDataHeader
          onBack={() => navigate("extract/upload")}
          onSubmit={handleSubmit}
          isUploadComplete={true}
        />
        <Divider margin="0px" />
        <div className="display-flex flex-justify-center padding-top-4">
          <ExtractStepper currentStep={ExtractStep.Extract} />
        </div>
        <Divider margin="0px" />
      </div>
      </LoadingWrapper>

  );
};

export default ExtractProcess;
