import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@trussworks/react-uswds/lib/uswds.css";
import "@trussworks/react-uswds/lib/index.css";
import "./style/index.scss";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UploadTemplate } from "./pages/UploadTemplate.tsx";
import AnnotateTemplate from "./pages/AnnotateTemplate.tsx";
import "./App.scss";
import ExtractUpload from "./pages/ExtractUpload.tsx";
import ExtractProcess from "./pages/ExtractProcess.tsx";
import { SaveTemplate } from "./pages/SaveTemplate.tsx";
import ReviewTemplate from "./pages/ReviewTemplate.tsx";
import SubmissionTemplate from "./pages/SubmissionTemplate.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorPage from "./pages/ErrorPage.tsx";
import { ErrorProvider } from "./contexts/ErrorContext.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RootLayout from "./components/RootLayout";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout><ProtectedRoute><App /></ProtectedRoute></RootLayout>,
  },
  {
    path: "/new-template/upload",
    element: <RootLayout><ProtectedRoute><UploadTemplate /></ProtectedRoute></RootLayout>,
  },
  {
    path: "/new-template/annotate",
    element: <RootLayout><ProtectedRoute><AnnotateTemplate /></ProtectedRoute></RootLayout>,
  },
  {
    path: "/extract/upload",
    element: <RootLayout><ProtectedRoute><ExtractUpload /></ProtectedRoute></RootLayout>,
  },
  {
    path: "/extract/process",
    element: <RootLayout><ProtectedRoute><ExtractProcess /></ProtectedRoute></RootLayout>,
  },
  {
    path: "/new-template/save",
    element: <RootLayout><ProtectedRoute><SaveTemplate /></ProtectedRoute></RootLayout>,
  },
  {
    path: "/extract/review",
    element: <RootLayout><ProtectedRoute><ReviewTemplate /></ProtectedRoute></RootLayout>,
  },
  {
    path: "/extract/submit",
    element: <RootLayout><ProtectedRoute><SubmissionTemplate /></ProtectedRoute></RootLayout>,
  },
  {
    path: "/login",
    element: <RootLayout><LoginPage /></RootLayout>,
  },
  {
    path: "*",
    element: <RootLayout><ErrorPage title="Sorry, this page can't be found" body="The page you are looking for doesn't exist or has been moved." /></RootLayout>,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorProvider>
  </StrictMode>
);