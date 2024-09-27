import {Shape} from "react-image-label";


// -----------------------------------------------------------------------------
// Report Vision Models
// -----------------------------------------------------------------------------

type Base64<imageType extends string> = `data:image/${imageType};base64${string}`

interface Template {
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

interface Label {
    key: string;
    color: string;
    humanReadableName: string;
    required: boolean;
    createdAt: Date;
    updatedAt: Date | undefined;
    createdBy: User;
    updatedBy: User | undefined;
}

interface Page {
    id: string;
    baseImage: Base64<"png">;
    segmentationTemplate: Base64<"png">;
    labels: Label[];
    shapes: Shape[];
    createdAt: Date;
    updatedAt: Date | undefined;
    createdBy: User;
    updatedBy: User | undefined;
}

interface User {
    id: string;
    name: string;
    email: string;
    password: string; // This will need to be hashed and salted
    organization: Organization;
    createdAt: Date;
    updatedAt: Date | undefined;
}

interface Upload {
    id: string;
    createdBy: User;
    updatedBy: User | undefined;
    createdAt: Date;
    updatedAt: Date | undefined;
    extractions: Extraction[];
}

interface Extraction {
    status: ExtractionStatus;
    segmentationTemplate: Template;
    pages: Base64<"png">[];
    fields: ExtractedField[];
    corrections: ExtractedField[]; // Human corrections
    createdAt: Date;
    updatedAt: Date | undefined;
    createdBy: User;
    updatedBy: User | undefined;
}

type ExtractionStatus = "In Progress" | "In Review" | "Submission" | "Discarded"

interface ExtractedField {
    label: string;
    value: string;
    confidence: number | undefined; // Optional because it doesn't need to be stored for human corrections
    createdAt: Date;
    updatedAt: Date | undefined;
    createdBy: User;
    updatedBy: User | undefined;
}

interface Organization {
    id: string;
    name: string;
    admin: User;
    createdAt: Date;
    updatedAt: Date | undefined;
}

interface Notification {
    id: string;
    organization: Organization;
    content: string;
    createdBy: User;
    updatedBy: User | undefined;
    createdAt: Date;
    updatedAt: Date | undefined;
}
// -----------------------------------------------------------------------------
// Metadata Models
// -----------------------------------------------------------------------------

interface FeatureFlag {
    id: string;
    name: string;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date | undefined;
    organization: Organization;
    // Intentionally not including createdBy and updatedBy, users aren't creating feature flags
}
