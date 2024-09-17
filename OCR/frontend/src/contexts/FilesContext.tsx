import { createContext, useContext, useState, ReactNode } from 'react';
import { Shape } from './AnnotationContext';

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
    sourceImage: string;
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
  files: FileType[];
  addFile: (file: FileType) => void;
  removeFile: (fileName: string) => void;
  clearFiles: () => void;
}

const FilesContext = createContext<FileContextType | undefined>(undefined);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileType[]>([]);

  const addFile = (file: FileType) => {
    setFiles(() => [file]);
  };

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return (
    <FilesContext.Provider value={{ files, addFile, removeFile, clearFiles }}>
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
