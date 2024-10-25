import React from "react";
import { Button, Icon, Header } from "@trussworks/react-uswds";

import './ExtractDataHeader.scss'

interface ExtractDataHeaderProps {
  onBack: () => void;
  onSubmit: () => void;
  onExit: () => void;
  isUploadComplete: boolean;
  hasSubmit?: boolean;
}

export const ExtractDataHeader: React.FC<ExtractDataHeaderProps> = ({
  onBack,
  onSubmit,
  onExit,
  isUploadComplete,
  hasSubmit = true,
}) => {
  return (
    <Header className="extract-header">
      <div
        className="display-flex height-full flex-align-center"
        style={{ justifyContent: "space-between" }}
      >
        <div
          className="display-flex flex-align-center"
          style={{ justifyContent: "flex-start" }}
        >
          <Button
            className="extract-close-button"
            data-testid="close-button"
            unstyled
            type="button"
            onClick={onExit}
          >
            <Icon.Close size={3} color="black" />
          </Button>
          <h1>Extract data</h1>
        </div>
        <div className="display-flex flex-align-center">
          <Button
            className="extract-button-reset"
            onClick={onBack}
            type="reset"
            outline
          >
            Back
          </Button>
          {
            hasSubmit && (
              <Button
                className="extract-button-submit"
                onClick={onSubmit}
                type="submit"
                disabled={!isUploadComplete}
              >
                Submit
              </Button>
            )
          }
        </div>
      </div>
    </Header>
  );
};

export default ExtractDataHeader;
