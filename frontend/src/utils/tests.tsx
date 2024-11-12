import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { FilesProvider } from "../contexts/FilesContext";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Wrapper = ({ children }: { children: ReactNode }) => {
    return <QueryClientProvider client={queryClient}><BrowserRouter><FilesProvider>{children}</FilesProvider></BrowserRouter></QueryClientProvider>;
}