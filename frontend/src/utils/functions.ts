import { CustomShape } from "../contexts/AnnotationContext";
import { ImageData } from "../pages/AnnotateTemplate";
// import {useCreateTemplateStore} from "../types/templates.ts";

export const makeScreenshots = async (images, shapes) => {
    // const images: ImageData[] = JSON.parse(localStorage.getItem('images') || '[]') as ImageData[];
    // const shapes: CustomShape[][] = JSON.parse(localStorage.getItem('shapes') || '[]') as CustomShape[][];
    const screenshots: string[] = [];

    for (let i = 0; i < images.length; i++) {
        try {
            const screenshot = await createScreenshot(images[i], shapes[i] ?? []);
            screenshots.push(screenshot);
        } catch (e) {
            console.log(e);
        }
    }

    // Final log of all screenshots
    // localStorage.setItem('screenshots', JSON.stringify(screenshots));
    return screenshots;
};

const createScreenshot = (localImg: ImageData, shapeData: CustomShape[]) => {
    return new Promise<string>((resolve) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            canvas.width = Number(localImg.width);
            canvas.height = Number(localImg.height);
            const img = new Image();
            img.src = localImg.image;

            img.onload = () => {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                shapeData.forEach((shape) => {
                    context.fillStyle = shape.color || 'red';

                    const xCoords = shape.points.map(point => point[0]);
                    const yCoords = shape.points.map(point => point[1]);

                    const xMin = Math.min(...xCoords);
                    const yMin = Math.min(...yCoords);
                    const xMax = Math.max(...xCoords);
                    const yMax = Math.max(...yCoords);

                    const width = xMax - xMin;
                    const height = yMax - yMin;

                    // Draw the rectangle based on the calculated coordinates
                    context.fillRect(xMin, yMin, width, height);
                });

                const screenshot = canvas.toDataURL('image/png');
                resolve(screenshot);
                canvas.remove();
                context.closePath();
            };
            // If the image fails to load, reject the promise
            img.onerror = () => {
                console.error('Failed to load image');
                resolve('');
                context.closePath();
                canvas.remove();
            }
        }
    });
};