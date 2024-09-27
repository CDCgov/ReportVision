interface Template {
    name: string;
    lastUpdated: Date | undefined;
    createdBy: string | undefined;
    lab: string | undefined;
    status: TemplateStatus;
}

type TemplateStatus = "Completed"