import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FileContextType {
  files: File[];
  addFile: (file: File) => void;
  removeFile: (fileName: string) => void;
  clearFiles: () => void;
}

const FilesContext = createContext<FileContextType | undefined>(undefined);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<File[]>([]);

  const addFile = (file: File) => {
    setFiles((prevFiles) => [...prevFiles, file]);
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
