import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { Uploadfile } from '../UploadFile';

describe('Uploadfile component', () => {
  it('renders the header with correct text', () => {
    render(<Uploadfile />);

    // Check for the main heading
    const mainHeading = screen.getByRole('heading', { name: /upload new form to segment/i });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveStyle({ margin: '0' });

    // Check for the subheading
    const subHeading = screen.getByRole('heading', { name: /upload new image or pdf and save as a template/i });
    expect(subHeading).toBeInTheDocument();
    expect(subHeading).toHaveStyle({ margin: '0' });
  });

  it('renders the upload area with correct structure', () => {
    render(<Uploadfile />);

    // Check for the dashed border container
    const dashedContainer = screen.getByTestId('dashed-container');
    expect(dashedContainer).toBeInTheDocument();
    expect(dashedContainer).toHaveStyle({
      width: '70%',
      height: '40%',
      border: '1px dashed #005ea2',
    });

    // Check for the icon
    const uploadIcon = screen.getByTestId('upload-icon');
    expect(uploadIcon).toBeInTheDocument();

    // Check for the "Drag and drop file here" text
    const dragDropText = screen.getByRole('heading', { name: /drag and drop file here/i });
    expect(dragDropText).toBeInTheDocument();
    expect(dragDropText).toHaveStyle({ fontWeight: 'bold' });

    // Check for the FileInput
    const fileInput = screen.getByTestId('file-input-input');
    expect(fileInput).toBeInTheDocument();
  });
});
