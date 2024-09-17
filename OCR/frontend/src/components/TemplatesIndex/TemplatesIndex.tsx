import {FC, useEffect, useState} from "react";
import {Button} from "@trussworks/react-uswds";
import {SortableTable} from "../SortableTable/SortableTable.tsx";
import {useNavigate} from "react-router-dom";
import extractImage from "../../assets/extract_image.svg";

interface TemplateIndexProps {
}

export const TemplatesIndex: FC<TemplateIndexProps> = ({}) => {
    const [templates, setTemplates] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const templatesJSON = localStorage.getItem("templates")
        setTemplates(JSON.parse(templatesJSON))
    }, []);

    useEffect(() => {

        const localStorageEvent = (event) => {
            if (event.storageArea === localStorage) {
                console.log("Local Storage Updated")
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
        'lab': 'Lab',
        'createdBy': 'Creator',
        'status': 'Status',
        'lastUpdated': 'Updated On'
    }

    const templateColumnFormatters = {

        'lastUpdated': (d) => {
            const date = Date.parse(d)
            if (isNaN(date)) {
                return "Invalid Date"
            }
            return new Date(date).toLocaleDateString()

        }
    }

    const templateColumns = [
        'name', 'lastUpdated', 'createdBy', 'lab', 'status'
    ]
    const templates2: Template[] = [

        {
            name: "MumpsQuestV1",
            lab: "Quest",
            createdBy: "J.Smith",
            status: "Completed",
            lastUpdated: new Date(Date.parse("2025-03-24T12:00:00.000-05:00"))
        },
        {
            name: "LBTIRadar",
            lab: "Radar",
            createdBy: "C.Alex",
            status: "Completed",
            lastUpdated: new Date(Date.parse("2025-05-30T12:00:00.000-05:00"))
        },
        {
            name: "COVIDBaylor1",
            lab: "Emory",
            createdBy: "A.Bryant",
            status: "Completed",
            lastUpdated: new Date(Date.parse("2025-06-21T12:00:00.000-05:00"))
        },
        {
            name: "COVIDEMory",
            lab: "Baylor",
            createdBy: "D.Smith",
            status: "Completed",
            lastUpdated: new Date(Date.parse("2024-06-21T12:00:00.000-05:00"))
        },
    ];

    // TODO: These are just for demo purposes and allow easily manipulating the template store
    useEffect(() => {
        console.debug(`
        The following methods have been added to the window:
        
        LoadNiceTemplates - this will load some pre-formatted templates that display nicely
        SaveTemplates - this will save the current templates to 'oldTemplates'
        LoadSavedTemplates - this will load the templates saved in 'oldTemplates'
        ClearTemplates - this will delete the current templates 
        
        `)
        window.LoadNiceTemplates = () => {
            const oldTemplates = localStorage.getItem('templates')
            localStorage.setItem('oldTemplates', oldTemplates)
            localStorage.setItem('templates', JSON.stringify(templates2))
            setTemplates(templates2)
        }
        window.SaveTemplates = () => {
            const oldTemplates = localStorage.getItem('templates')
            if (!oldTemplates) {
                return
            }
            localStorage.setItem('oldTemplates', oldTemplates)
        }
        window.ClearTemplates = () => {
            localStorage.removeItem('templates')
            setTemplates([])
        }
        window.LoadSavedTemplates = () => {
            const oldTemplates = localStorage.getItem('oldTemplates')
            if (oldTemplates) {
                localStorage.setItem('templates', oldTemplates)
                setTemplates(JSON.parse(oldTemplates))
            }
        }
        return () => {
            delete window.LoadNiceTemplates
            delete window.SaveTemplates
            delete window.ClearTemplates
            delete window.LoadSavedTemplates
        }
    }, []);

    if (!templates || templates.length === 0) {
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
                    <SortableTable columns={templateColumns} data={templates}
                                   formatters={templateColumnFormatters}
                                   columnNames={templateColumnNames}/>
                </div>
            </div>
        </>)
}


