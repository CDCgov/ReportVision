import { Icon } from "@trussworks/react-uswds"
import { ChangeEvent, useId } from "react"
import { FileInput } from "./FileInput"
import { useFiles } from "../contexts/FilesContext"
import { useNavigate } from "react-router-dom"

interface IFilesObj {
    files: File[]
}

export const Uploadfile = () => {
    const id = useId()
    const {addFile} = useFiles()
    const navigate = useNavigate()

    async function handleChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target?.files?.length > 0) {
            const fileList = event.target.files
            const filesObj: IFilesObj = {files: []}
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                filesObj['files'].push(file)
            }
            localStorage.setItem('files', JSON.stringify(filesObj))
            addFile(event.target?.files[0])
            navigate('/new-template/annotate')
        }
    }

    return (
        <div className="display-flex flex-column flex-align-center flex-justify-start height-full width-full padding-2 bg-primary-lighter">
            <div style={{ width: '70%', textAlign: 'left' }}>
                <h1 style={{  margin: 0 }}>Upload new form to segment</h1>
                <h2 style={{ margin: 0 }}>Upload new image or PDF and save as a template</h2>
            </div>
            <div data-testid='dashed-container' className="display-flex flex-column margin-top-205 flex-justify flex-align-center bg-white" style={{ width: '70%', height: '40%', border: '1px dashed  #005ea2' }}>
                <Icon.UploadFile data-testid='upload-icon' style={{ marginTop: '16px' }} size={5} color="#005ea2" />
                <div className="display-flex flex-column flex-align-center margin-bottom-1" style={{ width: '60%' }}>
                    <h3 style={{ fontWeight: 'bold'}}>Drag and drop file here</h3>
                    <p>or</p>
                    <FileInput onChange={handleChange} id={`file-input-${id}`} className="padding-bottom-2" style={{ border: '1px dashed #005ea2' }} name="file-input-single" chooseText="Browse Files" dragText="  " />
                </div>
            </div>
        </div>
    )
}