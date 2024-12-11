import { Label, TextInput } from "@trussworks/react-uswds";
import { Divider } from "../components/Divider";
import { UploadHeader } from "../components/Header";
import { Stepper } from "../components/Stepper";
import { AnnotateStep } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAnnotationContext } from "../contexts/AnnotationContext";
import { FileType, Page } from "../contexts/FilesContext";
import hexRgb from "hex-rgb";
import { makeScreenshots } from "../utils/functions";
import { useCreateTemplateStore } from "../types/templates.ts";

export const SaveTemplate = () => {
  const navigate = useNavigate();
  const {
    fields,
    setName,
    name,
    condition,
    facility,
    shapes,
    setCondition,
    setFacility,
    setShapes,
    setFields,
    setDrawnFields,
    setSelectedField,
  } = useAnnotationContext();
  const baseImages = useCreateTemplateStore((state) => state.baseImages);
  const storeTemplateImages = useCreateTemplateStore(
    (state) => state.setTemplateImages,
  );
  const reset = useCreateTemplateStore((state) => state.reset);

  const handleSubmit = async () => {
    // const images: ImageData[] = localStorage.getItem('images') ? JSON.parse(localStorage.getItem('images') as string) : [];
    const images = baseImages;
    let pages: Page[] = [];
    const tempFields = fields.filter((field) => field.size > 0);

    const screenshots = await makeScreenshots(images, shapes);
    storeTemplateImages(screenshots);

    if (images.length > 0) {
      pages = tempFields.map((_, index) => {
        const shape = shapes[index];
        return {
          fieldNames: shape.map((s) => {
            const { red, green, blue } = hexRgb(s.color as string);
            return {
              type: "text",
              color: `${red},${green},${blue}`,
              label: s.field,
            };
          }),
          sourceImage: images[index],
          templateImage: screenshots[index],
          shapes: shape,
        };
      });
      if (pages.length !== images.length) {
        images.forEach((_: unknown, idx: number) => {
          if (!tempFields[idx]) {
            pages.push({
              fieldNames: [],
              sourceImage: {
                image: "",
                height: "",
                width: "",
              },
              templateImage: "",
              shapes: [],
            });
          }
        });
      }
      const tempFile: FileType = {
        name,
        condition,
        facility,
        created: new Date().toLocaleDateString(),
        pages: pages,
      };

      let existingTemplates = [];
      try {
        const data = localStorage.getItem("templates");
        if (data) {
          existingTemplates = JSON.parse(data);
        }
      } catch {
        console.error(
          "Invalid information found in templates, it will be overwritten",
        );
      }
      // TODO: Need to persist this to the backend
      localStorage.setItem(
        "templates",
        JSON.stringify([...existingTemplates, tempFile]),
      );
    }

    setShapes([]);
    setFields([new Set(), new Set()]);
    setDrawnFields(new Set());
    setSelectedField(null);
    setName('');
    setFacility('');
    setCondition('');
    reset();
    navigate("/");
  };

  return (
    <div
      className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2"
      data-testid="save-template-page"
    >
      <UploadHeader
        title="Save template"
        onBack={() => navigate("/new-template/annotate")}
        isDisabled={name.length === 0 || facility.length === 0 || condition.length === 0}
        onSubmit={handleSubmit}
      />
      <Divider margin="0px" />
      <div className="display-flex flex-justify-center padding-top-4">
        <Stepper currentStep={AnnotateStep.Save} />
      </div>
      <Divider margin="0px" />
      <div className="display-flex flex-column flex-align-center flex-justify-start flex-align-center height-full width-full padding-2 bg-primary-lighter">
        <h1 style={{ width: "500px" }} data-testid="save-template-title">
          Save segmentation as a template
        </h1>
        <div style={{ width: "500px" }} data-testid="save-template-form">
          <div className="display-flex flex-column flex-align-self-center">
            <div className="display-flex flex-column flex-align-start width-full">
              <Label htmlFor="segmentation-template-name">
                Segmentation template name*
              </Label>
              <TextInput
                id="segmentation-template-name"
                className="bg-white"
                onChange={(e) => setName(e.target.value)}
                name="segmentation-template-name"
                type="text"
                data-testid="segmentation-template-name-input"
              />
            </div>
          </div>
          <div className="display-flex flex-column flex-align-self-center">
            <div className="display-flex flex-column flex-align-start width-full">
              <Label htmlFor="segmentation-template-facility">
                Facility*
              </Label>
              <TextInput
                id="segmentation-template-facility"
                onChange={(e) => setFacility(e.target.value)}
                value={facility}
                required
                className="bg-white"
                name="segmentation-template-facility"
                type="text"
                data-testid="segmentation-template-facility-input"
              />
            </div>
          </div>
          <div className="display-flex flex-column flex-align-self-center">
            <div className="display-flex flex-column flex-align-start width-full">
              <Label htmlFor="segmentation-template-condition">
                Condition*
              </Label>
              <TextInput
                id="segmentation-template-condition"
                value={condition}
                required
                onChange={(e) => setCondition(e.target.value)}
                className="bg-white"
                name="segmentation-template-condition"
                type="text"
                data-testid="segmentation-template-condition-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
