import { Icon } from "@trussworks/react-uswds";

interface ErrorBannerProps {
    title: string
    message: string
}

const ErrorBanner = ({ title, message }: ErrorBannerProps) => {
  return (
    <div className="error-container">
        <div className="error-header">
            <Icon.Error className="error-icon" />
            <h2 className="error-title">{title}</h2>
        </div>
        <p className="error-message">
            {message}
        </p>
    </div>
  );
}

export default ErrorBanner;