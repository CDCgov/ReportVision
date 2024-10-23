import { Button } from '@trussworks/react-uswds';
import { FC, useEffect } from 'react';
import { ImageAnnotator, Shape } from 'react-image-label';
import { useAnnotationContext } from '../contexts/AnnotationContext';
import { LABELS } from '../constants/labels';

interface MultiImageAnnotatorProps {
    images: string[];
    categories: string[];
    initialShapes?: Shape[][];
}

export const MultiImageAnnotator: FC<MultiImageAnnotatorProps> = ({ images, initialShapes = [[]] }) => {
    const {selectedField, setHandles, annotator, shapes, setShapes, index, setIndex } = useAnnotationContext();




    const handleImageChange = (index: number) => {
        setIndex(index);
    };

    const handleShapeAddition = (shape: Shape) => {
        const fields = [...LABELS.patientInformation.items, ...LABELS.organizationInformation.items];
        const field = fields.find(field => field.name === selectedField?.name);
        const updatedShapes = [...shapes];
        // for field?.color.slice(0,7) to remove the alpha channel from the hexcode 
        updatedShapes[index] = [...(updatedShapes[index] || []), {...shape, field: selectedField?.name as string, color: field?.color}];
        setShapes(updatedShapes);
        localStorage.setItem('shapes', JSON.stringify(updatedShapes));
        annotator?.updateCategories(shape.id, [], field?.color);
        annotator!.stop();
    };

    const handleShapeSelection = (shape: Shape) => {
        annotator?.edit(shape.id);
    };
    useEffect(() => {
        const getShapes = async () => {
            const localStorageShapes = await JSON.parse(localStorage.getItem('shapes') || '[]') as unknown as Array<Array<Shape>> || [];
            setShapes(localStorageShapes.length > 0 ? localStorageShapes : initialShapes);
        }
        getShapes();
    }, [])
    return (
        <div className='display-flex flex-justify-center flex-align-center flex-column'>
            <div>
                {images.map((_, index) => (
                        <Button key={index} onClick={() => handleImageChange(index)} type='button'>
                            Image {index + 1}
                        </Button>
                ))}
            </div>
            <ImageAnnotator
                setHandles={setHandles}
                naturalSize={true}
                imageUrl={images[index]}
                shapes={shapes[index] || []}
                onAdded={handleShapeAddition}
                onSelected={handleShapeSelection}
                onReady={() => { }}
            />
        </div>
    );
}
