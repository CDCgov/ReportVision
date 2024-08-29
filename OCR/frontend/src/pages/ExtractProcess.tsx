import { useNavigate } from "react-router-dom";
import {
  Button,
  Header,
  Icon,
  StepIndicator,
  StepIndicatorStep,
} from "@trussworks/react-uswds";

const ExtractProcess = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header className="padding-y-2">
        <div className="grid-container">
          <div className="grid-row">
            <div className="grid-col-6 display-flex">
              <Button
                unstyled
                type="button"
                onClick={() => navigate("/")}
                className="padding-right-1"
              >
                <Icon.Close size={3} color="black" />
              </Button>
              <h1 className="margin-0">Extract Data</h1>
            </div>
            <div className="grid-col-6 display-flex flex-justify-end flex-align-center">
              <Button
                type="button"
                onClick={() => navigate("/extract/upload")}
                className="margin-right-1"
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </Header>

      <div className="grid-container">
        <div className="grid-row">
          <div className="grid-col-12 display-flex flex-justify-center">
            <StepIndicator headingLevel="h5">
              <StepIndicatorStep label="Choose and upload" status="complete" />
              <StepIndicatorStep label="Extract data" status="current" />
              <StepIndicatorStep label="Review and edit" status="incomplete" />
              <StepIndicatorStep label="Submit data" status="incomplete" />
            </StepIndicator>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExtractProcess;
