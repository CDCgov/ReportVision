import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'

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
import { SaveTemplate } from './pages/SaveTemplate.tsx';


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
  }
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
