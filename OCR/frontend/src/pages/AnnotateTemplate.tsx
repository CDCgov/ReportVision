import React, {useEffect, useState} from 'react';
import {UploadHeader} from "../componets/Header.tsx";
import {Divider} from "../componets/Divider.tsx";
import {Stepper} from "../componets/Stepper.tsx";
import {AnnotateStep} from "../utils/constants.ts";
import {useFiles} from "../contexts/FilesContext.tsx";
import  * as pdfjsLib from "pdfjs-dist";
import Sidebar from '../componets/Sidebar';
import { LABELS } from '../constants/labels';

const AnnotateTemplate: React.FC = () => {


  const [images, setImages] = useState<string[]>([]);

  const {files} = useFiles();
  const pdfFile = files[0];
  if (pdfFile === undefined) {
    // navigate back to upload
  }


  useEffect(() => {
   
    if (!(pdfFile instanceof File)) {
      console.error("pdfFile is not a valid File object");
      return;
    }
    

    //CDN works, todo investigate a way to circumvent this issue
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const convertPdfToImages = async (file: File) => {
      const images: Array<string>= [];
      const data = URL.createObjectURL(file)
      const pdf = await pdfjsLib.getDocument(data).promise;
      const canvas = document.createElement("canvas");
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 1 });
        const context = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        images.push(canvas.toDataURL());
      }
      canvas.remove();
      URL.revokeObjectURL(data);
      return images;
    }

    convertPdfToImages(pdfFile).then((imgs) => {
      setImages(imgs);
      console.log(imgs)
    });

  }, [files])

  console.log(images)

  return (
    <div className="display-flex flex-column height-full">
      <UploadHeader />
      <Divider margin="0px" />
      <div className="display-flex flex-justify-center padding-top-4">
        <Stepper currentStep={AnnotateStep.Annotate} />
      </div>
      <Divider margin="0px" />
      <div className="display-flex flex-row flex-1 overflow-hidden">
        <Sidebar labels={LABELS} />
        <div className="flex-1 padding-2">
          <div className="text-left margin-bottom-2">
            <h2>Segment and label</h2>
            <p className="text-base">Annotate by segmenting and labeling your new template.</p>
          </div>
          <Divider margin="0px" />
          <div className="height-full">
            {pdfFile instanceof File ? (
              <iframe className="width-full height-full" src={URL.createObjectURL(pdfFile)}></iframe>
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


