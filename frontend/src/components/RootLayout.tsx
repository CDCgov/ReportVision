import { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { AnnotationProvider } from '../contexts/AnnotationContext';
import { FilesProvider } from '../contexts/FilesContext';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <AuthProvider>
      <AnnotationProvider>
        <FilesProvider>
          {children}
        </FilesProvider>
      </AnnotationProvider>
    </AuthProvider>
  );
};

export default RootLayout;