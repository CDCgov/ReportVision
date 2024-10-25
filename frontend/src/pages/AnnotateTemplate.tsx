import { UploadHeader } from "../components/Header.tsx";
import { Divider } from "../components/Divider.tsx";
import { Stepper } from "../components/Stepper.tsx";
import { AnnotateStep } from "../utils/constants.ts";
import { useFiles } from "../contexts/FilesContext.tsx";
import * as pdfjsLib from "pdfjs-dist";
import { Accordion, HeadingLevel } from "@trussworks/react-uswds";

import { MultiImageAnnotator } from "../components/ImageAnnotator.tsx";
import { useNavigate } from "react-router-dom";
import { LABELS } from "../constants/labels";
import { Icon } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import { useAnnotationContext } from "../contexts/AnnotationContext.tsx";
import CheckIcon from '../assets/check.svg';

import "./AnnotateTemplate.scss";

interface AccordionItemProps {
  title: React.ReactNode | string;
  content: React.ReactNode;
  expanded: boolean;
  id: string;
  className?: string;
  headingLevel: HeadingLevel;
  handleToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface LabelItem {
  name: string;
  displayedName: string;
  required: boolean;
  color: string;
  subItems?: LabelItem[];
}

interface LabelCategory {
  title: string;
  items: LabelItem[];
}

export interface ImageData {
  image: string;
  height: string;
  width: string;
}

const AnnotateTemplate: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [localIds, setLocalIds] = useState<Map<string, string>>(new Map());
  const navigate = useNavigate();
  const { files } = useFiles();
  const {
    selectedField,
    setSelectedField,
    annotator,
    setFields,
    fields,
    index,
    setIndex,
    drawnFields,
    setShapes,
    setDrawnFields,
  } = useAnnotationContext();
  const pdfFile = files[0];

  useEffect(() => {
    if (!(pdfFile instanceof File)) {
      console.error("pdfFile is not a valid File object");
      return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const convertPdfToImages = async (file: File) => {
      const images: Array<ImageData> = [];
      const data = URL.createObjectURL(file);

      const pdf = await pdfjsLib.getDocument(data).promise;
      const canvas = document.createElement("canvas");
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 1 });
        const context = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport })
          .promise;
        images.push({image: canvas.toDataURL(), height: viewport.height.toString(), width: viewport.width.toString()});
      }
      canvas.remove();
      URL.revokeObjectURL(data);
      return images;
    };

    convertPdfToImages(pdfFile).then((imgs) => {
      setImages(imgs);
      localStorage.setItem("images", JSON.stringify(imgs));
    });
  }, [files, pdfFile]);
  useEffect(() => {
    const getImage = async () => {
      const localImages = await JSON.parse(
        localStorage.getItem("images") || "[]"
      );
      if (localImages && localImages.length > 0) {
        setImages(localImages.images);
      }
    };

    const handleUnmount = () => {
      setShapes([]);
      setDrawnFields(new Set());
      setSelectedField(null);
    }
    getImage();
    return () => handleUnmount();
  }, []);
  const renderLabelContent = (category: LabelCategory): JSX.Element => (
    <ul className="usa-list usa-list--unstyled">
      {category.items.map((item, idx) => (
        <li
          key={item.displayedName}
          className={`display-flex flex-justify space-between flex-align-center padding-y-1 label-container margin-0 width-full ${selectedField?.name === item.name ? 'hover' : null}`}
          onClick={() => {
            setSelectedField({
                displayedName: item.displayedName,
                name: item.name,
                id: String(category.title === 'Organization Information' ? idx + 1 + 7 : idx + 1),
                color: item.color.slice(0, 7),
            });
            const tempFields = [...fields];
            const tempMap = new Map(localIds);
            if (!tempFields[index].has(item.name)) {
              annotator!.drawRectangle();
              tempFields[index].add(item.name);
              tempMap.set(`${category.title === 'Organization Information' ? idx + 7 : idx}`, String(drawnFields.size + 1));
              setFields(tempFields);
              setLocalIds(tempMap);
            } else {
              annotator!.edit(Number(localIds.get(`${category.title === 'Organization Information' ? idx + 7 : idx}`)));
            }
          }}
        >
          <div className="display-flex flex-align-center width-full">
            <div
              className="display-flex flex-align-center bg-primary padding-1px "
              style={{ backgroundColor: item.color || "#007BFF" }}
            >
              <Icon.TextFields color="white" />
            </div>
            <span className="margin-left-1 text-normal field-label-container">{item.displayedName}&nbsp;{drawnFields.has(item.name) &&<img src={CheckIcon} alt="check-icon" role="presentation" />}</span>
          </div>
        </li>
      ))}
    </ul>
  );
  const accordionItems: AccordionItemProps[] = Object.entries(LABELS).map(
    ([key, category]) => ({
      title: category.title,
      content: renderLabelContent(category),
      expanded: false,
      id: key,
      headingLevel: "h3",
    })
  );

  const handleSubmit = async () => {
    annotator!.stop();
    try {
      navigate("/new-template/save");
      setIndex(0)
    } catch (err) {
      console.error("Error taking screenshot", err);
    }
  };

  return (
    <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2">
      <UploadHeader
        title="Annotate new template"
        onBack={() => navigate("/new-template/upload")}
        onSubmit={handleSubmit}
      />
      <Divider margin="0px" />
      <div className="display-flex flex-justify-center padding-top-4">
        <Stepper currentStep={AnnotateStep.Annotate} />
      </div>
      <Divider margin="0px" />
      <div className="display-flex height-full overflow-hidden">
        <div className="display-flexflex-3 height-full overflow-y-auto field-container">
          <h2 className="annotate-headers">Segment and label</h2>
          <p className="text-base annotation-copy">
          Segmenting means selecting and highlighting a specific part of an image. After segmenting, link it to the correct label that describes what the segment represents.
          </p>
          <Divider margin="0px" />
          <h2 className="annotate-headers annotate-label-heading">Labels Required</h2>
          <Accordion  className="accordion" items={accordionItems} />
        </div>
        <div
          id="img-annotator-container"
          className="img-annotation-container width-full height-full overflow-y-auto display-flex flex-justify-center"
        >
          {Array.isArray(images) && images.length > 0 ? (
            <MultiImageAnnotator images={images.map(img => img.image)} categories={[]} />
          ) : (
            <div className="display-flex flex-justify-center flex-align-center height-full">
              No image File available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnotateTemplate;
