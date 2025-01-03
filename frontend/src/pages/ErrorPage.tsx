import React from "react";
import image from "../../public/svgs/404.svg";
import { AppHeader } from "../components/AppHeader/AppHeader";
import { Button } from "@trussworks/react-uswds";
import { useNavigate } from "react-router-dom";

import "./404Page.scss";

interface ErrorPageProps {
  title: string;
  body: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ title, body }) => {
  const navigate = useNavigate();
  return (
    <div className="width-full height-full display-flex flex-column">
      <AppHeader jurisdiction={""} />
      <div className="error-content">
        <h1 className="error-cta">{title}</h1>
        <img data-testid="404-image" src={image} alt="404" />
        <p>{body}</p>
        <Button onClick={() => navigate("/")} type="button">
          Back to Previous Page
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
