import { FC } from "react";
import { Button, Icon, Header } from "@trussworks/react-uswds";

import "./AppHeader.scss";
import reportVisionLogo from "../../assets/datalink_placeholder_logo.svg";
import { useNavigate } from "react-router-dom";

interface IndexHeaderProps {
  jurisdiction: string;
}

export const AppHeader: FC<IndexHeaderProps> = ({
  jurisdiction,
}: IndexHeaderProps) => {
  const navigate = useNavigate();
  return (
    <>
      <Header
        basic={true}
        role={`banner`}
        className="header width-full display-flex flex-row flex-justify-start bg-primary-darker padding-1 padding-left-4 padding-right-4 text-base-lightest flex-gap-half"
      >
        <div className="display-flex flex-justify-center">
          <Button unstyled type="button" onClick={() => navigate("/")}>
            <img className="width-3" src={reportVisionLogo} alt={`IDWA`} />
          </Button>
        </div>
        <div className="text-bold font-ui-md  display-flex flex-align-center">
          ReportVision
        </div>
        <div className="padding-left-1 display-flex flex-align-center">
          {jurisdiction}
        </div>
        <div className="flex-align-end flex-justify-end flex-1"></div>
        <div className=" display-flex flex-justify-center">
          <a>Log Out</a>
        </div>
        <div className="display-flex flex-justify-center">
          <a>
            <Icon.Person className={`text-base-lightest usa-icon--size-3`} />
          </a>
        </div>
        <div className="display-flex flex-justify-center">
          <a>
            <Icon.Settings className={`text-base-lightest usa-icon--size-3`} />
          </a>
        </div>
      </Header>
    </>
  );
};
