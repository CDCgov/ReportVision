import {Organization, Page, User} from "./models.ts";

export interface Template {
    id: string;
    name: string;
    description: string;
    labName: string
    pages: Page[];
    status: TemplateStatus;
    createdBy: User;
    updatedBy: User | undefined;
    createdAt: Date;
    updatedAt: Date | undefined;
    organization: Organization;
}

type TemplateStatus = "Completed" | "In Progress" | "Deprecated"

const MIDDLEWARE_URL = import.meta.env.MIDDLEWARE_API_URL || 'http://localhost:8081';
export const TemplateAPI = {
    getTemplates: async (): Promise<Template[]> => {
        const response = await fetch(`${MIDDLEWARE_URL}/templates`);
        const jsonResponse = await response.json();
        return jsonResponse._embedded.templates;
    }
}
