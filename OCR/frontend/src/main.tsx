import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./style/index.scss";
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
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AnnotationProvider>
      <FilesProvider>
        <RouterProvider router={router} />
      </FilesProvider>
    </AnnotationProvider>
  </StrictMode>
);
