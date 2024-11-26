import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { Uploadfile } from '../UploadFile';
import { Wrapper } from '../../utils/tests';

describe('Uploadfile component', () => {

    


  it('renders the header with correct text', () => {
    render(<Uploadfile />, {wrapper: Wrapper});

    // Check for the main heading
    const mainHeading = screen.getByRole('heading', { name: /Upload new file to annotate/i });
    expect(mainHeading).toBeInTheDocument();
  });

  it('renders the upload area with correct structure', () => {
    render(<Uploadfile />, {wrapper: Wrapper});

    // Check for the dashed border container
    const dashedContainer = screen.getByTestId('dashed-container');
    expect(dashedContainer).toBeInTheDocument();


    // Check for the "Drag and drop file here" text
    const dragDropText = screen.getByText(/drag files here or/i);
    expect(dragDropText).toBeInTheDocument();

    // Check for the FileInput
    const fileInput = screen.getByTestId('file-input-input');
    expect(fileInput).toBeInTheDocument();
  });
});
