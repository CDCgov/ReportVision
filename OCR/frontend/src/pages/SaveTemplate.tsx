import { Label, TextInput } from "@trussworks/react-uswds";
import { Divider } from "../componets/Divider";
import { UploadHeader } from "../componets/Header";
import { Stepper } from "../componets/Stepper";
import { AnnotateStep } from "../utils/constants";
import { useNavigate } from "react-router-dom";

export const SaveTemplate = () => {
    const navigate = useNavigate();
    return (
        <div className="display-flex flex-column flex-justify-start width-full height-full padding-1 padding-top-2" data-testid="save-template-page">
            <UploadHeader
                title="Save template"
                onBack={() => navigate("/new-template/annotate")}
                onSubmit={() => navigate("/")}
            />
            <Divider margin="0px" />
            <div className="display-flex flex-justify-center padding-top-4">
                <Stepper currentStep={AnnotateStep.Save} />
            </div>
            <Divider margin="0px" />
            <div className="display-flex flex-column flex-align-center flex-justify-start flex-align-center height-full width-full padding-2 bg-primary-lighter">
                <h1 style={{ width: '500px' }} data-testid="save-template-title">
                    Save segmentation as a template
                </h1>
                <div style={{ width: '500px' }} data-testid="save-template-form">
                    <div className="display-flex flex-column flex-align-self-center">
                        <div className="display-flex flex-column flex-align-start width-full">
                            <Label htmlFor="segmentation-template-name">
                                Segmentation template name
                            </Label>
                            <TextInput
                                id="segmentation-template-name"
                                className="bg-white"
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