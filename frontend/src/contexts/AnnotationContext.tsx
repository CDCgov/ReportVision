import { createContext, useState, useContext, ReactNode } from "react";
import { useImageAnnotator } from "react-image-label";

export interface Shape {
  points: number[][];
  categories: string[];
  phi: number;
  color?: string | undefined;
  id: number;
}

export interface CustomShape extends Shape {
  field: string;
}

interface Field {
  displayedName: string;
  name: string;
  id: string;
  color: string;
}

interface AnnotationContextType {
  selectedField: Field | null;
  setSelectedField: (field: Field | null) => void;
  annotator: AnnotatorHandles | undefined;
  setHandles: React.Dispatch<
    React.SetStateAction<AnnotatorHandles | undefined>
  >;
  shapes: CustomShape[][];
  fields: Array<Set<string>>;
  drawnFields: Set<string>;
  setFields: React.Dispatch<React.SetStateAction<Array<Set<string>>>>;
  setDrawnFields: React.Dispatch<React.SetStateAction<Set<string>>>;
  setShapes: React.Dispatch<React.SetStateAction<CustomShape[][]>>;
  name: string;
  condition: string;
  facility: string;
  setName: (name: string) => void;
  setCondition: (condition: string) => void;
  setFacility: (facility: string) => void;
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

const AnnotationContext = createContext<AnnotationContextType | undefined>(
  undefined,
);

export const AnnotationProvider = ({ children }: AnnotationProviderProps) => {
  const [fields, setFields] = useState<Array<Set<string>>>([
    new Set(),
    new Set(),
  ]);
  const [drawnFields, setDrawnFields] = useState<Set<string>>(new Set());
  const [name, setName] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [facility, setFacility] = useState<string>("");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [shapes, setShapes] = useState<CustomShape[][]>([]);
  const [index, setIndex] = useState<number>(0);
  const { setHandles, annotator } = useImageAnnotator();

  return (
    <AnnotationContext.Provider
      value={{
        selectedField,
        setSelectedField,
        annotator,
        setHandles,
        shapes,
        setShapes,
        fields,
        setFields,
        name,
        setName,
        condition,
        setCondition,
        facility,
        setFacility,
        index,
        setIndex,
        drawnFields,
        setDrawnFields,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
};

export const useAnnotationContext = () => {
  const context = useContext(AnnotationContext);
  if (!context) {
    throw new Error(
      "useAnnotationContext must be used within an AnnotationProvider",
    );
  }
  return context;
};
