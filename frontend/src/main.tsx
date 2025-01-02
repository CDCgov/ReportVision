import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@trussworks/react-uswds/lib/uswds.css";
import "@trussworks/react-uswds/lib/index.css";

import "./style/index.scss";

import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UploadTemplate } from "./pages/UploadTemplate.tsx";
import { FilesProvider } from "./contexts/FilesContext.tsx";
import AnnotateTemplate from "./pages/AnnotateTemplate.tsx";
import "./App.scss";
import { AnnotationProvider } from "./contexts/AnnotationContext.tsx";
import ExtractUpload from "./pages/ExtractUpload.tsx";
import ExtractProcess from "./pages/ExtractProcess.tsx";
import { SaveTemplate } from "./pages/SaveTemplate.tsx";
import ReviewTemplate from "./pages/ReviewTemplate.tsx";
import SubmissionTemplate from "./pages/SubmissionTemplate.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorPage from "./pages/ErrorPage.tsx";
import { ErrorProvider } from "./contexts/ErrorContext.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/new-template/upload",
    element: <UploadTemplate />,
  },
  {
    path: "/new-template/annotate",
    element: <AnnotateTemplate />,
  },
  {
    path: "/extract/upload",
    element: <ExtractUpload />,
  },
  {
    path: "/extract/process",
    element: <ExtractProcess />,
  },
  {
    path: "/new-template/save",
    element: <SaveTemplate />,
  },
  {
    path: "/extract/review",
    element: <ReviewTemplate />,
  },
  {
    path: "/extract/submit",
    element: <SubmissionTemplate />,
  },
  {
    path: "*",
    element: <ErrorPage title="Sorry, this page can’t be found" body="The page you are looking for doesn’t exist or has been moved." />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorProvider>
        <QueryClientProvider client={queryClient}>
          <AnnotationProvider>
            <FilesProvider>
              <RouterProvider router={router} />
            </FilesProvider>
          </AnnotationProvider>
        </QueryClientProvider>
    </ErrorProvider>
  </StrictMode>,
);
