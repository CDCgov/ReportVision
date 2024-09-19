export interface Label {
    color: string;
    label: string;
    type: string;
}

export type Labels = Label[];

export interface ImageToTextArgs {
    fieldNames: Labels;
    sourceImage: string;
    templateImage: string;
}

export type ImageToTextResponse = {
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