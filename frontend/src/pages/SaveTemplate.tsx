import { Label, TextInput } from "@trussworks/react-uswds";
import { Divider } from "../components/Divider";
import { UploadHeader } from "../components/Header";
import { Stepper } from "../components/Stepper";
import { AnnotateStep } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAnnotationContext } from "../contexts/AnnotationContext";
import { FileType, Page } from "../contexts/FilesContext";
import hexRgb from "hex-rgb";
import { ImageData } from "./AnnotateTemplate";
import { makeScreenshots } from "../utils/functions";



export const SaveTemplate = () => {
    const navigate = useNavigate();
    const { fields, setDescription, setName, name, description, shapes, setShapes, setFields, setDrawnFields, setSelectedField } = useAnnotationContext()
    
    const handleSubmit = async () => {
        const images: ImageData[] = localStorage.getItem('images') ? JSON.parse(localStorage.getItem('images') as string) : [];
        let pages: Page[] = [];
        const tempFields = fields.filter(field => field.size > 0);
        
        const screenshots = await makeScreenshots()

        if (images.length > 0) {
            pages = tempFields.map((_, index) => {
                const shape = shapes[index]
                return {
                    fieldNames: shape.map(s => {
                        const { red, green, blue } = hexRgb(s.color as string);
                        return {
                            type: 'text',
                            color: `${red},${green},${blue}`,
                            label: s.field
                        }
                    }),
                    sourceImage: images[index],
                    templateImage: screenshots[index],
                    shapes: shape
                }
            });
            const tempFile: FileType = {
                name,
                description,
                pages: pages
    
            }

        let existingTemplates = []
        try {
            const data = localStorage.getItem('templates');
            if (data) {
                existingTemplates = JSON.parse(data);
            }

        } catch {
            console.error("Invalid information found in templates, it will be overwritten")
        }
        localStorage.setItem('templates', JSON.stringify([...existingTemplates, tempFile]))
        }

        setShapes([]);
        setFields([new Set(), new Set()]);
        setDrawnFields(new Set());
        setSelectedField(null);
        localStorage.setItem('shapes', '');
        localStorage.setItem('images', '');
        localStorage.setItem('screenshots', '');
        localStorage.setItem('images', '');
        localStorage.setItem('files', '');
        navigate("/")
    } 
    
    return (
        <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2"
             data-testid="save-template-page">
            <UploadHeader
                title="Save template"
                onBack={() => navigate("/new-template/annotate")}
                onSubmit={handleSubmit}
            />
            <Divider margin="0px"/>
            <div className="display-flex flex-justify-center padding-top-4">
                <Stepper currentStep={AnnotateStep.Save}/>
            </div>
            <Divider margin="0px"/>
            <div
                className="display-flex flex-column flex-align-center flex-justify-start flex-align-center height-full width-full padding-2 bg-primary-lighter">
                <h1 style={{width: '500px'}} data-testid="save-template-title">
                    Save segmentation as a template
                </h1>
                <div style={{width: '500px'}} data-testid="save-template-form">
                    <div className="display-flex flex-column flex-align-self-center">
                        <div className="display-flex flex-column flex-align-start width-full">
                            <Label htmlFor="segmentation-template-name">
                                Segmentation template name
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
                            <Label htmlFor="segmentation-template-description">
                                Segmentation template description
                            </Label>
                            <TextInput
                                id="segmentation-template-description"
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-white"
                                name="segmentation-template-description"
                                type="text"
                                data-testid="segmentation-template-description-input"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
