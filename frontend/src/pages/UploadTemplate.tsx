import { useNavigate } from "react-router-dom"
import { Divider } from "../components/Divider"
import { UploadHeader } from "../components/Header"
import { Stepper } from "../components/Stepper"
import { Uploadfile } from "../components/UploadFile"
import { AnnotateStep } from "../utils/constants"
import { useFiles } from "../contexts/FilesContext"

export const UploadTemplate = () => {
    const navigate = useNavigate();
    const { files } = useFiles();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', width: '100%', height: '100%', padding: '16px 8px, 8px, 8px' }}>
            <UploadHeader title="Annotate new template" onBack={() => {navigate('/')}} onSubmit={() => navigate('/new-template/annotate')} isUpload={files.length === 0} />
            <Divider margin="0px" />
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '32px'}}>
                <Stepper currentStep={AnnotateStep.Upload} />
            </div>
            <Divider margin="0px" />
            <Uploadfile />
        </div>
    )
}