import React, { useEffect, useState } from "react";
import { UploadHeader } from "../componets/Header.tsx";
import { Divider } from "../componets/Divider.tsx";
import { Stepper } from "../componets/Stepper.tsx";
import { AnnotateStep } from "../utils/constants.ts";
import { useFiles } from "../contexts/FilesContext.tsx";
import * as pdfjsLib from "pdfjs-dist";
import { Accordion, AccordionItemProps } from "@trussworks/react-uswds";
import { LABELS } from "../constants/labels";
import "./AnnotateTemplate.scss";
import { Icon } from "@trussworks/react-uswds";

interface LabelItem {
  name: string;
  required: boolean;
  color: string;
  subItems?: LabelItem[];
}

interface LabelCategory {
  title: string;
  items: LabelItem[];
}

const AnnotateTemplate: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const { files } = useFiles();
  const pdfFile = files[0];

  useEffect(() => {
    if (!(pdfFile instanceof File)) {
      console.error("pdfFile is not a valid File object");
      return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const convertPdfToImages = async (file: File) => {
      const images: Array<string> = [];
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
        images.push(canvas.toDataURL());
      }
      canvas.remove();
      URL.revokeObjectURL(data);
      return images;
    };

    convertPdfToImages(pdfFile).then((imgs) => {
      setImages(imgs);
    });
  }, [files]);

  const renderLabelContent = (category: LabelCategory): JSX.Element => (
    <ul className="usa-list usa-list--unstyled">
      {category.items.map((item) => (
        <li
          key={item.name}
          className="display-flex flex-justify space-between flex-align-center padding-y-1"
        >
          <div className="display-flex flex-align-center">
            <div
              className="display-flex flex-align-center bg-primary padding-1px radius-md"
              style={{ backgroundColor: item.color || "#007BFF" }}
            >
              <Icon.TextFields color="white" />
            </div>
            <span className="margin-left-1 text-normal">
              {item.name}
            </span>
          </div>
          {!item.required && (
            <span style={{ color: "#6c757d" }} className="text-right margin-left-auto">
              Not found
            </span>
          )}
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
    }),
  );

  return (
    <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2">
      <UploadHeader />
      <Divider margin="0px" />
      <div className="display-flex flex-justify-center padding-top-4">
        <Stepper currentStep={AnnotateStep.Annotate} />
      </div>
      <Divider margin="0px" />
      <div className="grid-row height-full">
        <div className="grid-col flex-3">
          <h2>Segment and label</h2>
          <p className="text-base">
            Annotate by segmenting and labeling your new template.
          </p>
          <Divider margin="0px" />
          <Accordion items={accordionItems} />
        </div>
        <div className="grid-col flex-7">
          <div className="height-full">
            {pdfFile instanceof File ? (
              <iframe
                className="width-full height-full"
                src={URL.createObjectURL(pdfFile)}
              ></iframe>
            ) : (
              <div>No PDF file available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotateTemplate;
