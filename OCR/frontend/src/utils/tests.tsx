import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { FilesProvider } from "../contexts/FilesContext";

export const Wrapper = ({ children }: { children: ReactNode }) => {
    return <BrowserRouter><FilesProvider>{children}</FilesProvider></BrowserRouter>;
}