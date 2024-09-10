import { Button, Header, Icon } from "@trussworks/react-uswds"
import { useNavigate } from "react-router-dom";

interface UploadHeaderProps {
    title: string;
    onBack: () => void;
    onSubmit: () => void;
}

export const UploadHeader = ({ title, onBack, onSubmit }: UploadHeaderProps) => {
    const navigate = useNavigate();
    return (
        <Header style={{ height: '50px', padding: '8px' }}>
        <div className="display-flex height-full flex-align-center" style={{ justifyContent: 'space-between' }}>
            <div className="display-flex flex-jusitfy-start height-full flex-align-center" style={{ justifyContent: 'space-between' }}>
                <Button onClick={() => navigate('/')} data-testid='close-button' unstyled type="button" style={{ paddingRight: '8px' }}>
                    <Icon.Close size={3} color="black" />
                </Button>
                <h1>{title}</h1>
            </div>
            <div className="display-flex flex-jusitfy-start height-full flex-align-center">
                <Button onClick={onBack} type="reset" outline style={{ height: '40px', boxShadow: 'inset 0 0 0 2px  #adadad', color: '#adadad'}} >Back</Button>
                <Button onClick={onSubmit} type="submit" base style={{ height: '40px' }}>Submit</Button>
            </div>
        </div>
    </Header>
    )
}

