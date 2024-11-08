import { createContext, useContext, useState, ReactNode } from 'react';
import { Shape } from './AnnotationContext';
import { ImageData } from '../pages/AnnotateTemplate';

export interface TemplatePair {
  fileName: string;
  templateName: string;
}

export interface Field {
    color: string;
    label: string;
    type: string;
}

export interface Field {
    color: string;
    label: string;
    type: string;
}

export interface Page {
    // base 64 encoded image
    sourceImage: ImageData;
    templateImage: string;
    fieldNames: Field[];
    shapes: Shape[];
}

export interface FileType {
    name: string;
    description: string;
    pages: Page[];
}

interface FileContextType {
  files: File[];
  selectedTemplates: TemplatePair[];
  addFile: (file: File) => void;
  removeFile: (fileName: string) => void;
  clearFiles: () => void;
  setFiles: (files: File[]) => void;
  setSelectedTemplates: (templates: TemplatePair, index: number) => void;
  clearTemplates: () => void;
}

const FilesContext = createContext<FileContextType | undefined>(undefined);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTemplates, _setSelectedTemplates] = useState<TemplatePair[]>([]);
  const addFile = (file: File) => {
    setFiles((prev) => [...prev, file]);
  };

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const setSelectedTemplates = (template: TemplatePair, index: number) => {
    _setSelectedTemplates((prev) => {
      const updatedTemplates = [...prev];
      if (index < updatedTemplates.length) {
        // Update the template at the specified index
        updatedTemplates[index] = template;
      } else if (index === updatedTemplates.length) {
        // Add a new template if the index is equal to the length of the array
        updatedTemplates.push(template);
      }
      return updatedTemplates;
    });
  };

  const clearTemplates = () => {
    _setSelectedTemplates([]);
  }

  return (
    <FilesContext.Provider value={{ files, selectedTemplates, addFile, removeFile, clearFiles, setFiles, setSelectedTemplates, clearTemplates }}>
      {children}
    </FilesContext.Provider>
  );
};

export const useFiles = (): FileContextType => {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
};
