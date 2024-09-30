export function base64ToBlob(base64Data: string): Blob {
    // Remove the data URL part if it exists
    const base64String = base64Data.split(',')[1];
  
    // Decode base64 string into binary data
    const binaryString = atob(base64String);
  
    // Create a Uint8Array from the binary string
    const binaryData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }
  
    // Create a Blob from the binary data
    const blob = new Blob([binaryData], { type: 'image/png' });
  
    return blob;
}

export function convertBase64SvgToBase64Png(base64Svg: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
      // Create an Image object
      const img: HTMLImageElement = new Image();
      
      // Set the image source to the base64-encoded SVG
      img.src = `data:image/svg+xml;base64,${base64Svg}`;
      
      img.onload = () => {
          // Create a canvas element
          const canvas: HTMLCanvasElement = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

          if (!ctx) {
              reject(new Error('Failed to get canvas context'));
              return;
          }

          // Draw the SVG image onto the canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert the canvas content to a PNG base64 data URL
          const base64Png = canvas.toDataURL('image/png');

          // Remove the prefix ("data:image/png;base64,") and return the base64 string
          resolve(base64Png.replace(/^data:image\/png;base64,/, ''));
      };

      img.onerror = () => {
          reject(new Error('Failed to load SVG image'));
      };
  });
}
