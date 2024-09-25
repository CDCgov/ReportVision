import { Button } from '@trussworks/react-uswds';
import { FC, useEffect, useState } from 'react';
import { ImageAnnotator, Shape } from 'react-image-label';
import { useAnnotationContext } from '../contexts/AnnotationContext';
import { LABELS } from '../constants/labels';

interface MultiImageAnnotatorProps {
    images: string[];
    categories: string[];
    initialShapes?: Shape[][];
}

export const MultiImageAnnotator: FC<MultiImageAnnotatorProps> = ({ images, categories, initialShapes = [[]] }) => {
    const {selectedField, setHandles, annotator, shapes, setShapes, index, setIndex } = useAnnotationContext();
    const [dialog, setDialog] = useState<{ show: boolean, shape: Shape | undefined }>({ show: false, shape: undefined });

    const selectedCategoriesChanged = (items: string[]) => {
        dialog.shape!.categories = items;
        setDialog({ ...dialog });
    };
    const hideDialog = () => setDialog({ show: false, shape: undefined });
    const hideAndUpdateCategories = () => {
        if (dialog.show) {
            annotator!.updateCategories(dialog.shape!.id, dialog.shape!.categories, "#27f17640");
            hideDialog();
        }
    };

    const handleImageChange = (index: number) => {
        setIndex(index);
    };

    const handleShapeAddition = (shape: Shape) => {
        const fields = [...LABELS.patientInformation.items, ...LABELS.organizationInformation.items];
        const field = fields.find(field => field.name === selectedField?.name);
        const updatedShapes = [...shapes];
        // for field?.color.slice(0,7) to remove the alpha channel from the hexcode 
        updatedShapes[index] = [...(updatedShapes[index] || []), {...shape, field: selectedField?.name as string, color: field?.color.slice(0,7)}];
        setShapes(updatedShapes);
        localStorage.setItem('shapes', JSON.stringify(updatedShapes));
        annotator?.updateCategories(shape.id, [], field?.color);
        annotator!.stop();
    };

    const handleShapeContextMenu = (shape: Shape) => {
        setDialog({ show: false, shape });
        setShapes(shapes)
    };

    const handleShapeSelection = (shape: Shape) => {
        annotator?.edit(shape.id);
        setDialog({ show: false, shape });
    };

    useEffect(() => {
        const localStorageShapes = localStorage.getItem('shapes') as unknown as Array<Array<Shape>> || [[]];
        setShapes(localStorageShapes.length > 0 ? localStorageShapes : initialShapes);
    }, [])
    return (
        <div>
            {dialog.show &&
                <Dialog
                    items={dialog.shape!.categories}
                    itemsChanged={selectedCategoriesChanged}
                    onEdit={() => { annotator!.edit(dialog.shape!.id); hideDialog(); }}
                    onDelete={() => {console.log(dialog);
                         setShapes(shapes.map((shape) => shape.filter(s => s.id !== dialog.shape!.id)));
                         annotator!.delete(dialog.shape!.id); hideDialog(); }}
                    onClose={hideAndUpdateCategories}
                    offset={dialog.shape!.getCenterWithOffset()}
                    categories={categories}
                />
            }
            <div>
                {images.map((_, index) => (
                        <Button key={index} onClick={() => handleImageChange(index)} type='button'>
                            Image {index + 1}
                        </Button>
                ))}
            </div>
            <ImageAnnotator
                id='image-annotator'
                setHandles={setHandles}
                naturalSize={true}
                imageUrl={images[index]}
                shapes={shapes[index] || [[]]}
                onAdded={handleShapeAddition}
                onContextMenu={handleShapeContextMenu}
                onSelected={handleShapeSelection}
                onReady={() => { }}
            />
            <div>{JSON.stringify(shapes[index], null, 2)}</div>
        </div>
    );
}

const Dialog = ({ items=['item1', 'item2', 'item3'], itemsChanged, onClose, onEdit, onDelete, offset, categories }: DialogProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCheck = (event: any) => {
        let selected = items;
        if (event.target.checked) selected = [...selected, event.target.value];
        else selected.splice(selected.indexOf(event.target.value), 1);
        selected.sort((c1, c2) => categories.indexOf(c1) - categories.indexOf(c2));
        itemsChanged(selected);
    };
    return (
        <div className='bg-accent-warm' onClick={onClose}>
            <div  onClick={e => e.stopPropagation()}
                style={{ left: offset.X, top: offset.Y }}>
                <Button type='button' onClick={onEdit}>edit</Button>
                <Button type='button' onClick={onDelete}>delete</Button>
                {categories.map((_class, i) => (
                    <div key={i} className="checkbox-wrapper-1">
                        <input id={'chb' + i} className="substituted" type="checkbox" aria-hidden="true"
                            value={_class} onChange={handleCheck} checked={items.includes(_class)} />
                        <label htmlFor={'chb' + i}>{_class}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface DialogProps {
    items: string[],
    itemsChanged: (items: string[]) => void,
    onClose: () => void,
    onEdit: () => void,
    onDelete: () => void,
    offset: { X: number, Y: number },
    categories: string[]
}
