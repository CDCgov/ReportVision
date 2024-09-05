import React from "react";
import { Button, Icon, Header } from "@trussworks/react-uswds";

interface ExtractDataHeaderProps {
  onBack: () => void;
  onSubmit: () => void;
  isUploadComplete: boolean;
}

export const ExtractDataHeader: React.FC<ExtractDataHeaderProps> = ({
  onBack,
  onSubmit,
  isUploadComplete,
}) => {
  return (
    <Header style={{ height: "50px", padding: "8px" }}>
      <div
        className="display-flex height-full flex-align-center"
        style={{ justifyContent: "space-between" }}
      >
        <div
          className="display-flex flex-align-center"
          style={{ justifyContent: "flex-start" }}
        >
          <Button
            data-testid="close-button"
            unstyled
            type="button"
            style={{ paddingRight: "8px" }}
            onClick={onBack}
          >
            <Icon.Close size={3} color="black" />
          </Button>
          <h1>Extract data</h1>
        </div>
        <div className="display-flex flex-align-center">
          <Button
            onClick={onBack}
            disabled={true}
            type="reset"
            outline
            style={{
              height: "40px",
              boxShadow: "inset 0 0 0 2px #adadad",
              color: "#adadad",
            }}
          >
            Back
          </Button>
          <Button
            onClick={onSubmit}
            type="submit"
            disabled={!isUploadComplete}
            style={{ height: "40px", marginLeft: "8px" }}
          >
            Submit
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default ExtractDataHeader;
