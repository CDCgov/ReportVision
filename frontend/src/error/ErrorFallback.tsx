import React from "react";
import { useError } from "../contexts/ErrorContext";

const FallbackUI: React.FC = () => {
  const { error, resetError } = useError();

  if (!error) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "16px",
        backgroundColor: "#f2dede",
        border: "1px solid #ebcccc",
        borderRadius: "4px",
      }}
    >
      <h4>Something went wrong:</h4>
      <p>{error.message}</p>
      <button onClick={resetError}>Dismiss</button>
    </div>
  );
};

export default FallbackUI;
