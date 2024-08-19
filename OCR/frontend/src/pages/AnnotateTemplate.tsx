import React, {useEffect, useState} from 'react';
import {UploadHeader} from "../componets/Header.tsx";
import {Divider} from "../componets/Divider.tsx";
import {Stepper} from "../componets/Stepper.tsx";
import {AnnotateStep} from "../utils/constants.ts";
import {useFiles} from "../contexts/FilesContext.tsx";
import  * as pdfjsLib from "pdfjs-dist";
import { MultiImageAnnotator } from '../componets/ImageAnnotator.tsx';
import { useNavigate } from 'react-router-dom';

const AnnotateTemplate: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const navigate = useNavigate();

  const {files} = useFiles();
  const pdfFile = files[0];
  if (pdfFile === undefined) {
    // navigate back to upload
  }


  useEffect(() => {

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
      return images;
    }

    convertPdfToImages(pdfFile).then((imgs) => {
      setImages(imgs);
      console.log(imgs)
    });

  }, [files])

  console.log(images)

  return (
    <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2">
      <UploadHeader onBack={() => navigate('/new-template/upload')} onSubmit={() => console.log('SUBMITTING')}/>
      <Divider margin="0px"/>
      <div className="display-flex flex-justify-center padding-top-4">
        <Stepper currentStep={AnnotateStep.Annotate}/>
      </div>
      <Divider margin="0px"/>

      <div className="grid-row height-full">
        <div className="grid-col flex-3 bg-white width-fill">
          <div className="text-left">
            <h2>Segment and label</h2>
            <p className="text-base">Annotate by segmenting and labeling your new template.</p></div>
            <Divider margin="0px"/>
        </div>
        <div className="grid-col flex-7 bg-accent-cool-lighter display-flex flex-justify-center">
          <MultiImageAnnotator images={images} categories={[]} />
        </div>
      </div>
    </div>
  )
};

export default AnnotateTemplate;