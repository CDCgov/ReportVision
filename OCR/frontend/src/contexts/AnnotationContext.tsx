import { createContext, useState, useContext, ReactNode } from 'react';
import { useImageAnnotator } from 'react-image-label';

export interface Shape {
  categories: string[];
  phi: number;
  color?: string | undefined;
  id: number;
}

export interface CustomShape extends Shape { 
  field: string;
}

interface Field {
    name: string;
    id: string;
    color: string;
}

interface AnnotationContextType {
  selectedField: Field | null;
  setSelectedField: (field: Field | null) => void;
  annotator: AnnotatorHandles | undefined;
  setHandles: React.Dispatch<React.SetStateAction<AnnotatorHandles | undefined>>
  shapes: CustomShape[][];
  fields: Array<Set<string>>;
  setFields: React.Dispatch<React.SetStateAction<Array<Set<string>>>>;
  setShapes: React.Dispatch<React.SetStateAction<CustomShape[][]>>;
  name: string;
  description: string;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  annotatedImages: string[];
  setAnnotatedImages: React.Dispatch<React.SetStateAction<string[]>>;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

interface AnnotationProviderProps {
    children: ReactNode;
}

type AnnotatorHandles = {
    drawRectangle(): void;
    drawPolygon(): void;
    drawCircle(): void;
    drawEllipse(): void;
    drawDot(): void;
    stop: () => void;
    stopEdit: () => void;
    edit: (id: number) => void;
    delete: (id: number) => void;
    updateCategories: (id: number, categories: string[], color?: string) => void;
    zoom: (factor: number, relative?: boolean) => void;
    getShapes: () => Shape[];
    container: HTMLDivElement;
};


const AnnotationContext = createContext<AnnotationContextType | undefined>(undefined);

export const AnnotationProvider = ({ children }: AnnotationProviderProps) => {
  const [fields, setFields] = useState<Array<Set<string>>>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [shapes, setShapes] = useState<CustomShape[][]>([]);
  const [annotatedImages, setAnnotatedImages] = useState<string[]>([]);
    const [index, setIndex] = useState<number>(0);
  const { setHandles, annotator } = useImageAnnotator();

  return (
    <AnnotationContext.Provider value={{ selectedField, setSelectedField, annotator, setHandles, shapes, setShapes, fields, setFields, name, setName, description, setDescription, annotatedImages, setAnnotatedImages, index, setIndex }}>
      {children}
    </AnnotationContext.Provider>
  );
};

export const useAnnotationContext = () => {
  const context = useContext(AnnotationContext);
  if (!context) {
    throw new Error('useAnnotationContext must be used within an AnnotationProvider');
  }
  return context;
};
