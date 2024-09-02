import { createContext, useState, useContext, ReactNode } from 'react';
import { Shape, useImageAnnotator } from 'react-image-label';

interface CustomShape extends Shape { 
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
  fields: Set<string>;
  setFields: React.Dispatch<React.SetStateAction<Set<string>>>;
  setShapes: React.Dispatch<React.SetStateAction<CustomShape[][]>>;
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
  const [fields, setFields] = useState<Set<string>>(new Set());
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [shapes, setShapes] = useState<CustomShape[][]>([]);
  const { setHandles, annotator } = useImageAnnotator();

  return (
    <AnnotationContext.Provider value={{ selectedField, setSelectedField, annotator, setHandles, shapes, setShapes, fields, setFields }}>
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
