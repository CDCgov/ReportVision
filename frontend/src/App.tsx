import { useState, useEffect } from "react";
import { Button, Link } from "@trussworks/react-uswds";
import { useLocation, useNavigate } from "react-router-dom";

import { AppHeader } from "./components/AppHeader/AppHeader.tsx";
import { TemplatesIndex } from "./components/TemplatesIndex/TemplatesIndex.tsx";

import Comment from './assets/comment.svg';
import CSV from './assets/csv.svg';
import "./App.scss";
import { useFiles } from "./contexts/FilesContext.tsx";

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setFiles } = useFiles();
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem("hasVisited", "true");
    }
    setFiles([]);
  }, []);

  const navLinks = [
    { text: "Annotate and Extract", url: "/" },
    {
      text: "Label Management",
      url: "/labels",
    },
    { text: "Dashboard", url: "/dashboard" },
  ];

  return (
    <>
      <div className="display-flex flex-column width-full height-full" data-testid="app-container">
        <AppHeader jurisdiction={`Demo STLT`} />
        <div className="display-flex flex-row height-full" data-testid="main-content">
          <div className="flex-3 padding-top-1 padding-left-1 padding-right-4 minw-15 usa-dark-background bg-primary-dark text-base-lightest display-flex flex-column flex-gap-1 maxw-30 side-nav" data-testid="side-nav">
            <div className="display-flex flex-column flex-align-start padding-top-2">
              {navLinks.map((i, idx) => {
                return (
                  <Link
                    key={idx}
                    href={i.url}
                    className={`border-left-2px padding-left-1 padding-top-2 padding-bottom-2 nav-link ${i.url === pathname ? "text-bold" : "border-primary-dark"}`}
                    data-testid={`nav-link-${idx}`}
                  >
                    {i.text}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex-10 display-flex flex-column bg-idwa-light" data-testid="content-area">
            <h2 className="padding-left-2 bg-white margin-top-0 home-header" data-testid="home-header">Annotate and Extract</h2>
            <div className="display-flex flex-justify-center app-content-container width-full" data-testid="app-content-container">
              {isFirstVisit ? (
                <div className="bg-white display-flex flex-column flex-justify flex-align-center first-time-content" data-testid="first-time-exp">
                  <h3 className="first-time-header" data-testid="first-time-header">
                    Welcome to Report Vision
                  </h3>
                  <p className="first-time-copy" data-testid="first-time-copy">
                    Let ReportVision take your lab reports from faxes and PDF’s and extract the data for seamless ingestion into your surveillance system.
                  </p>
                  <div className="first-time-card flex-row display-flex width-full flex-justify-center flex-align-center" data-testid="first-time-card">
                    <div className="display-flex flex-column flex-justify-center height-full card-column-image">
                      <img height="70px" width="130px" src={Comment} alt="comment" data-testid="comment-image" />
                      <img className="margin-top-6" height="100px" width="100px" src={CSV} alt="csv" data-testid="csv-image" />
                    </div>
                    <div className="display-flex flex-column flex-justify card-row">
                      <p className="img-copy margin-bottom-8" data-testid="img-copy-1">
                        1. Create templates for new lab reports.
                      </p>
                      <p className="img-copy" data-testid="img-copy-2">
                        2. Extract data and download it.
                      </p>
                    </div>
                  </div>
                  <p className="first-time-copy" data-testid="first-time-copy-2">
                    Let’s create your first annotated template for a lab report to enable quick extractions.
                  </p>
                  <Button
                    type="button"
                    className="usa-button display-flex flex-align-center margin-left-auto margin-right-auto margin-bottom-7"
                    onClick={() => navigate("/new-template/upload")}
                    data-testid="new-template-button"
                  >
                    + New Template
                  </Button>
                </div>
              ) : (
                <div className="flex-1 padding-left-2 padding-right-2 bg-idwa-light" data-testid="regular-content">
                  <p>
                    <span className="text-bold">Welcome Blake, </span>
                  </p>
                  <p>
                    Extract data from any PDFs, or images to send to your
                    surveillance systems using data from your saved templates or
                    create new segmentations.
                  </p>
                  <TemplatesIndex />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;