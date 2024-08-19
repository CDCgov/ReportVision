import { Button } from '@trussworks/react-uswds';
import { FC, useState } from 'react';
import { ImageAnnotator, useImageAnnotator, Shape } from 'react-image-label';

interface MultiImageAnnotatorProps {
    images: string[];
    categories: string[];
    initialShapes?: Shape[][];
}

export const MultiImageAnnotator: FC<MultiImageAnnotatorProps> = ({ images, categories, initialShapes = [] }) => {
    const { setHandles, annotator } = useImageAnnotator();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [shapes, setShapes] = useState<Shape[][]>(initialShapes);
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
        setCurrentImageIndex(index);
    };

    const handleShapeAddition = (shape: Shape) => {
        const updatedShapes = [...shapes];
        updatedShapes[currentImageIndex] = [...(updatedShapes[currentImageIndex] || []), shape];
        setShapes(updatedShapes);
        console.log(shape);
        setDialog({ show: true, shape });
    };

    const handleShapeContextMenu = (shape: Shape) => {
        setDialog({ show: true, shape });
    };

    const handleShapeSelection = (shape: Shape) => {
        setDialog({ show: true, shape });
    };
    console.log(dialog)
    return (
        <div>
            <div className='padding-1'>
                {images.map((_, index) => (
                    <Button key={index} onClick={() => handleImageChange(index)} type='button'>
                        Image {index + 1}
                    </Button>
                ))}
                <Button type='button' onClick={() => { annotator!.drawRectangle() }} title='draw-rectrangle'>Draw Rectangle</Button>
                <Button type='button' onClick={() => { annotator!.stop() }}>Stop Draw/Edit</Button>
            </div>
            {dialog.show &&
                <Dialog
                    items={dialog.shape!.categories}
                    itemsChanged={selectedCategoriesChanged}
                    onEdit={() => { annotator!.edit(dialog.shape!.id); hideDialog(); }}
                    onDelete={() => { annotator!.delete(dialog.shape!.id); hideDialog(); }}
                    onClose={hideAndUpdateCategories}
                    offset={dialog.shape!.getCenterWithOffset()}
                    categories={categories}
                />
            }
            <ImageAnnotator
                setHandles={setHandles}
                naturalSize={true}
                imageUrl={images[currentImageIndex]}
                shapes={shapes[currentImageIndex] || []}
                onAdded={handleShapeAddition}
                onContextMenu={handleShapeContextMenu}
                onSelected={handleShapeSelection}
                onReady={() => { }}
            />
            <div>{JSON.stringify(shapes[currentImageIndex], null, 2)}</div>
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
    console.log(offset)
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
