import {useState} from 'react'
import './App.scss'
import {Button, Link, SideNav} from "@trussworks/react-uswds";
import {useLocation, useNavigate, useNavigation} from "react-router-dom";

import {AppHeader} from "./components/AppHeader/AppHeader.tsx";
import dataLinkLogo from "./assets/datalink_placeholder_logo.svg";
import extractImage from "./assets/extract_image.svg"
function App() {
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const navLinks = [
        {text: "Annotate and Extract", url: "/annotate"},
        {text: "Label Management", url: "/labels"},
        {text: "Dashboard", url: "/"}
    ]


    return (
        <>
            <div className='display-flex flex-column width-full height-full'>
                <AppHeader jurisdiction={`Demo STLT`}/>
                <div className="display-flex flex-row height-full">
                    <div
                        className="flex-3 padding-top-1 padding-left-1 padding-right-4 minw-15 usa-dark-background bg-primary-dark text-base-lightest display-flex flex-column flex-gap-1 maxw-30"
                        >
                        <div className='display-flex flex-column flex-align-start padding-top-2'>
                            {navLinks.map((i, idx) => {
                                return <Link key={idx} href={i.url}
                                             className={`border-left-2px padding-left-1 padding-top-2 padding-bottom-2 ${i.url === pathname ? 'text-bold' : 'border-primary-dark'}`}>{i.text}</Link>
                            })}
                        </div>
                    </div>
                    <div className="flex-10 display-flex flex-column">
                        <h2 className="padding-left-2">Annotate and Extract</h2>
                        <div className=" flex-1 padding-left-2  padding-right-2 bg-idwa-light" >
                            <p><span className="text-bold">Welcome Blake, </span></p>
                            <p>Extract data from any PDFs, or images to send to your surveillance systems using data from your saved templates or create new segmentations.</p>
                            <img className="display-block margin-left-auto margin-right-auto padding-top-8"  src={extractImage} alt="Extract From Documents"/>
                            <p className="text-bold text-center">You have no segmentation templates set up yet. The templates will be used to extract data for your lab forms.</p>
                            <Button type="button" className="usa-button display-flex flex-align-center margin-left-auto margin-right-auto" onClick={() => navigate("/new-template/upload")}>+ New Template</Button>
                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}

export default App
