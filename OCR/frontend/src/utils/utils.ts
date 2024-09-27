export function base64ToBinaryFile(base64Data: string, fileName: string): File {
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
  
    // Create a file from the Blob if needed
    const file = new File([blob], fileName, { type: 'image/png' });
    console.log(file);
    saveFileLocally(file, fileName);
    return file;
  }

  function saveFileLocally(file: File, fileName: string) {
    // Create a URL for the file
    const url = URL.createObjectURL(file);
  
    // Create an anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
  
    // Clean up by revoking the object URL and removing the anchor element
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  }


