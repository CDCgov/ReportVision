import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style/index.scss'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { UploadTemplate } from './pages/UploadTemplate.tsx';
import { FilesProvider } from './contexts/FilesContext.tsx';
import AnnotateTemplate from './pages/AnnotateTemplate.tsx';

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
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FilesProvider>
      <RouterProvider router={router} />
    </FilesProvider>
  </StrictMode>,
)
