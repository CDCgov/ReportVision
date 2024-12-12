import { Organization, Page, User } from "./models.ts";
import { create } from "zustand";
import { Shape } from "react-image-label";

export interface Template {
  id: string;
  name: string;
  condition: string;
  facility: string;
  labName: string;
  pages: Page[];
  status: TemplateStatus;
  createdBy: User | null;
  updatedBy: User | undefined;
  createdAt: Date | null;
  updatedAt: Date | undefined;
  organization: Organization | null;
}

type TemplateStatus = "Completed" | "In Progress" | "Deprecated";

const MIDDLEWARE_URL =
  import.meta.env.VITE_MIDDLEWARE_API_URL || "http://localhost:8081";
export const TemplateAPI = {
  getTemplates: async (): Promise<Template[]> => {
    const response = await fetch(`${MIDDLEWARE_URL}/templates`);
    if (!response.ok) {
      throw new Error("Unable to fetch templates");
    }
    const jsonResponse = await response.json();
    return jsonResponse._embedded.templates;
  },
};

// This is the store for the new template, basically we can treat this as we were treating local storage
export const useCreateTemplateStore = create((set) => ({
  baseImages: [],
  shapes: [],
  templateImages: [],
  reset: () => {
    set({ baseImages: [], shapes: [], templateImages: [] });
  },
  setTemplateImages: (images: string[]) => set({ templateImages: images }),
  setShapes: (shapes: Shape[]) => set({ shapes: shapes }),
  setBaseImages: (images: ImageData[]) => set({ baseImages: images }),
}));
