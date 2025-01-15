import { createContext, useContext, useState, ReactNode } from "react";


type Error = typeof ERRORS[keyof typeof ERRORS] | null;

interface ErrorContextProps {
  error: Error | null;
  setError: (error: Error | null) => void;
  resetError: () => void;
}

const ErrorContext = createContext<ErrorContextProps>({
  error: null,
  setError: () => {
    /* no-op */
  },
  resetError: () => {
    /* no-op */
  },
});

interface ErrorProviderProps {
  children: ReactNode;
}

/** ErrorProvider component that wraps your entire application */
export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setErrorState] = useState<Error | null>(null);

  const setError = (newError: Error | null) => {
    setErrorState(newError);
  };

  const resetError = () => {
    setErrorState(null);
  };
  return (
    <ErrorContext.Provider
      value={{
        error,
        setError,
        resetError,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  return useContext(ErrorContext);
};

export const ERRORS = {
  NO_ERROR: null,
  GENERIC_ERROR: {
    title: "An error occurred",
    message: "Please try again later",
  },
  MISMATCH_ERROR: { 
    title: 'Mismatch Error',
    message: 'The uploaded file has a different number of pages than template. Please upload a file with correct pages pages to proceed or choose different template.'
  },
  CSV_ERROR: {
    title: 'Error downloading file',
    message: 'There was an issue with downloading your file. Please try again.'
  }
}