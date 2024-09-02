import { useNavigate } from "react-router-dom";
import ExtractDataHeader from "../componets/ExtractDataHeader";
import { Divider } from "../componets/Divider";
import { ExtractStepper } from "../componets/ExtractStepper";
import { ExtractStep } from "../utils/constants";

const ExtractProcess = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2">
        <ExtractDataHeader
          onBack={() => navigate("extract/upload")}
          onSubmit={() => navigate("/")}
          isUploadComplete={true}
        />
        <Divider margin="0px" />
        <div className="display-flex flex-justify-center padding-top-4">
          <ExtractStepper currentStep={ExtractStep.Extract} />
        </div>
        <Divider margin="0px" />
      </div>
    </>
  );
};

export default ExtractProcess;
