import { Header, Button } from '@trussworks/react-uswds';
import reportVisionLogo from "../assets/datalink_placeholder_logo.svg";
import { useNavigate } from 'react-router-dom';

import './LoginPage.scss'
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    const navigate = useNavigate();
    return (
        <div className="width-full height-full login-container">
            <Header
                basic={true}
                role={`banner`}
                className="header width-full display-flex flex-row flex-justify-start bg-primary-darker padding-1 padding-left-4 padding-right-4 text-base-lightest flex-gap-half"
            >
                <div className="display-flex flex-justify-center">
                <Button unstyled type="button" onClick={() => navigate("/login")}>
                    <img className="width-3" src={reportVisionLogo} alt={`IDWA`} />
                </Button>
                </div>
                <div className="text-bold font-ui-md  display-flex flex-align-center">
                    ReportVision
                </div>
                <div className="flex-align-end flex-justify-end flex-1"></div>
            </Header>
            <LoginForm />
        </div>
    );
};

export default LoginPage;