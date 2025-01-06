import { Shape } from "react-image-label";

// -----------------------------------------------------------------------------
// Report Vision Models
// -----------------------------------------------------------------------------

type Base64<imageType extends string> =
  `data:image/${imageType};base64${string}`;

export interface Label {
  key: string;
  color: string;
  humanReadableName: string;
  required: boolean;
  createdAt: Date;
  updatedAt: Date | undefined;
  createdBy: User;
  updatedBy: User | undefined;
}

export interface Page {
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

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // This will need to be hashed and salted
  organization: Organization;
  createdAt: Date;
  updatedAt: Date | undefined;
}

export interface Upload {
  id: string;
  createdBy: User;
  updatedBy: User | undefined;
  createdAt: Date;
  updatedAt: Date | undefined;
  extractions: Extraction[];
}

export interface Extraction {
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

type ExtractionStatus =
  | "In Progress"
  | "In Review"
  | "Submission"
  | "Discarded";

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number | undefined; // Optional because it doesn't need to be stored for human corrections
  createdAt: Date;
  updatedAt: Date | undefined;
  createdBy: User;
  updatedBy: User | undefined;
}

export interface Organization {
  id: string;
  name: string;
  admin: User;
  createdAt: Date;
  updatedAt: Date | undefined;
}

export interface Notification {
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

export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date | undefined;
  organization: Organization;
  // Intentionally not including createdBy and updatedBy, users aren't creating feature flags
}
