import { Field } from "../../src/contexts/FilesContext";

export interface Label {
    color: string;
    label: string;
    type: string;
}

export type Labels = Label[];

export type ImageToTextResponse = {
    [key: string]: [string, number];
};

export type AlignImageResponse = {
    [key: string]: [string, number];
};

export interface ResultItem {
    text: string;
    confidence: number;
  }
  
  export interface Submission {
    template_name: string;
    template_image: string; // Base64-encoded image string
    file_name: string;
    file_image: string; // Base64-encoded image string
    results: {
      [key: string]: ResultItem; // Allows any key with a ResultItem value
    };
  }

  export interface ImageToTextArgs {
    // base 64 encoded image
    sourceImage: string;
    templateImage: string;
    fieldNames: Field[];
}

export interface AlignImageArgs {
    // base 64 encoded image
    sourceImage: string;
    templateImage: string;
}
export interface PDF {
  file: string;
  images: string[];
}
