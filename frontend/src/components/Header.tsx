import { Button, Header, Icon } from "@trussworks/react-uswds";
import { useNavigate } from "react-router-dom";

import "./Header.scss";

interface UploadHeaderProps {
  title: string;
  isUpload?: boolean;
  isDisabled?: boolean;
  onBack: () => void;
  onSubmit?: () => void;
}

export const UploadHeader = ({
  title,
  isUpload,
  isDisabled,
  onBack,
  onSubmit,
}: UploadHeaderProps) => {
  const navigate = useNavigate();
  return (
    <Header className="header">
      <div className="display-flex height-full flex-align-center flex-justify">
        <div className="display-flex flex-jusitfy-start height-full flex-align-center flex-justify">
          <Button
            className="close-button"
            onClick={() => navigate("/")}
            data-testid="close-button"
            unstyled
            type="button"
          >
            <Icon.Close size={3} color="black" />
          </Button>
          <h1>{title}</h1>
        </div>
        <div className="display-flex flex-jusitfy-start height-full flex-align-center">
          <Button
            className="reset-button"
            onClick={onBack}
            type="reset"
            outline
          >
            Back
          </Button>
          {
            onSubmit && (
              <Button disabled={isUpload || isDisabled} onClick={onSubmit} type="submit" base>
                Submit
              </Button>
            )
          }
        </div>
      </div>
    </Header>
  );
};
