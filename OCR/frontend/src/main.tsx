import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style/index.scss'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { UploadTemplate } from './pages/UploadTemplate.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/new-template/upload",
    element: <UploadTemplate />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
