import {FC, useState} from "react";
import {Button, Icon, Header, GridContainer, Grid, NavMenuButton, PrimaryNav} from "@trussworks/react-uswds";

import * as styles from './AppHeader.module.scss';
import dataLinkLogo from '../../assets/datalink_placeholder_logo.svg';
import {useNavigate} from "react-router-dom";

interface IndexHeaderProps {
    jurisdiction: string
}

export const AppHeader: FC<IndexHeaderProps> = ({jurisdiction}: IndexHeaderProps) => {
    const navigate = useNavigate()
    return (
        <>
            {/*TODO: Move this adhoc style into a css class*/}
            <Header basic={true} role={`banner`}
                    className='header width-full display-flex flex-row flex-justify-start bg-primary-darker padding-1 padding-left-4 padding-right-4 text-base-lightest'
                    style={{gap: '.5rem'}}
            >
                <div className="display-flex flex-justify-center">
                    <Button unstyled type="button" onClick={() => navigate("/")}>
                        <img
                            className='width-3'
                            src={dataLinkLogo}
                            alt={`IDWA`}
                        />
                    </Button>
                </div>
                <div className='text-bold font-ui-md  display-flex flex-align-center'>
                    Datalink
                </div>
                <div className='padding-left-1 display-flex flex-align-center'>{jurisdiction}</div>
                <div className='flex-align-end flex-justify-end flex-1'></div>
                <div className=" display-flex flex-justify-center">
                    <a>
                        Log Out
                    </a>
                </div>
                <div className="display-flex flex-justify-center">
                    <a>
                        <Icon.Person className={`text-base-lightest usa-icon--size-3`}/>
                    </a>
                </div>
                <div className="display-flex flex-justify-center">
                    <a>
                        <Icon.Settings className={`text-base-lightest usa-icon--size-3`}/>
                    </a>
                </div>

            </Header>
        </>
    )
}
