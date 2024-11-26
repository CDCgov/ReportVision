import React from "react";
import "./LoadingWrapper.scss"; // You'll define some styles here

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  children,
  title = "Loading",
  subtitle = "Please wait a moment...",
}) => {
  return (
    <div className="loading-wrapper">
      {children}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingWrapper;
