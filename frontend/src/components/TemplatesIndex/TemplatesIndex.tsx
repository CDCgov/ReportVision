import {FC, useEffect, useState} from "react";
import {Button} from "@trussworks/react-uswds";
import {SortableTable} from "../SortableTable/SortableTable.tsx";
import {useNavigate} from "react-router-dom";
import extractImage from "../../assets/extract_image.svg";
import {useQuery} from "@tanstack/react-query";
import {TemplateAPI} from "../../types/templates.ts";

type TemplateIndexProps = unknown

export const TemplatesIndex: FC<TemplateIndexProps> = () => {
    const [templates, setTemplates] = useState([])
    const navigate = useNavigate()
    // TODO: Pagination and sorting will be added later
    const templateQuery = useQuery(
        {
            queryKey: ['templates'],
            queryFn: TemplateAPI.getTemplates
        }
    )
    useEffect(() => {
        const templatesJSON = localStorage.getItem("templates")
        setTemplates(JSON.parse(templatesJSON))
    }, []);

    useEffect(() => {

        const localStorageEvent = (event) => {
            if (event.storageArea === localStorage) {
                const templatesJSON = localStorage.getItem("templates")
                setTemplates(JSON.parse(templatesJSON))
            }
        }
        window.addEventListener("storage", localStorageEvent, false)

        return () => {
            window.removeEventListener('storage', localStorageEvent)
        }
    })


    const templateColumnNames = {
        'name': 'Name',
        'labName': 'Lab',
        'status': 'Status',
        'updatedAt': 'Updated On'
    }

    const templateColumnFormatters = {

        'updatedAt': (d) => {
            const date = Date.parse(d)
            if (isNaN(date)) {
                return new Date().toLocaleDateString()
            }
            return new Date(date).toLocaleDateString()

        }
    }

    const templateColumns = [
        'name', 'updatedAt', 'createdBy', 'labName', 'status'
    ]


    if (!templateQuery.data  || templateQuery.data.length === 0) {
        return (
            <><img
                className="display-block margin-left-auto margin-right-auto padding-top-8"
                src={extractImage} alt="Extract From Documents"/>
                <p className="text-bold text-center">You have no segmentation templates set up yet.
                    The
                    templates will be used to extract data for your lab forms.</p>
                <Button type="button"
                        className="usa-button display-flex flex-align-center margin-left-auto margin-right-auto"
                        onClick={() => navigate("/new-template/upload")}>+ New
                    Template</Button> </>
        )
    }

    return (
        <>
            <div className='bg-white padding-2 border-gray-5 border-1px'>
                <div className='display-flex flex-align-center '>
                    <div><h2>Template Catalog</h2></div>
                    <div className='flex-align-end flex-justify-end flex-1'></div>
                    <div className='padding-left-1'>
                        <Button type="button"
                                className="usa-button display-flex flex-align-center margin-left-auto margin-right-auto"
                                onClick={() => navigate("/extract/upload")}>Run Data Extraction</Button>
                    </div>
                    <div className='padding-left-1'>
                        <Button type="button" outline
                                className="usa-button display-flex flex-align-center margin-left-auto margin-right-auto"
                                onClick={() => navigate("/new-template/upload")}>+ New
                            Template</Button>
                    </div>
                </div>
                <div className="padding-1 border-1px border-gray-5 bg-white">
                    <h2>Saved Templates</h2>
                    <SortableTable columns={templateColumns} data={templateQuery.data || []}
                                   formatters={templateColumnFormatters}
                                   columnNames={templateColumnNames}
                    />
                </div>
            </div>
        </>)
}


