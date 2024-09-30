import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AnnotationProvider, useAnnotationContext } from './AnnotationContext';

// Mocking the useImageAnnotator hook
vi.mock('react-image-label', () => ({
  useImageAnnotator: () => ({
    annotator: undefined,
    setHandles: vi.fn(),
  }),
}));

// Mock component to test the context
const MockComponent = () => {
  const { selectedField, setSelectedField, shapes, setShapes } = useAnnotationContext();

  return (
    <div>
      <input
        type="text"
        placeholder="First Name"
        value={selectedField || ''}
        onChange={(e) => setSelectedField(e.target.value)}
      />
      <button onClick={() => setShapes([[], []])}>Set Shapes</button>
      <p data-testid="selectedField">{selectedField}</p>
      <p data-testid="shapesLength">{shapes.length}</p>
    </div>
  );
};

describe('AnnotationContext', () => {
  it('should provide the initial state', () => {
    render(
      <AnnotationProvider>
        <MockComponent />
      </AnnotationProvider>
    );

    expect(screen.getByPlaceholderText('First Name')).toHaveValue('');
    expect(screen.getByTestId('shapesLength')).toHaveTextContent('0');
  });

  it('should update shapes when setShapes is called', () => {
    render(
      <AnnotationProvider>
        <MockComponent />
      </AnnotationProvider>
    );

    const button = screen.getByText('Set Shapes');
    fireEvent.click(button);

    expect(screen.getByTestId('shapesLength')).toHaveTextContent('2');
  });

  it('should throw an error if useAnnotationContext is used outside AnnotationProvider', () => {
    const renderWithoutProvider = () => render(<MockComponent />);

    expect(renderWithoutProvider).toThrow('useAnnotationContext must be used within an AnnotationProvider');
  });
});
