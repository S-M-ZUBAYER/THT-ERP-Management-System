import { useState } from "react";
import { reduceImageResolution, reduceImagesResolution } from "./Warehouse&Cities.js/functionForImageResulation";

function ImageResize() {
  const [originalImage, setOriginalImage] = useState(null);
  const [reducedImage, setReducedImage] = useState(null);
  const [originalImages, setOriginalImages] = useState([]);
  const [reducedImages, setReducedImages] = useState([]);
  const [originalSizeInKB, setOriginalSizeInKB] = useState(null); // Add state for image sizes
  const [reducedSizeInKB, setReducedSizeInKB] = useState(null);

  // Function to handle single image reduction
  const handleSingleImageReduction = async (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const reduced = await reduceImageResolution(selectedImage, 800); // Replace 80 with your desired target size in KB
      setOriginalImage(URL.createObjectURL(selectedImage));
      setReducedImage(URL.createObjectURL(reduced));

      // Update image sizes
      setOriginalSizeInKB(/* Calculate and set the original image size in KB */);
      setReducedSizeInKB(/* Calculate and set the reduced image size in KB */);
    }
  };

  // Function to handle multiple image reduction
  const handleMultipleImagesReduction = async (event) => {
    const selectedImages = Array.from(event.target.files);
    if (selectedImages.length > 0) {
      const reduced = await reduceImagesResolution(selectedImages, 800); // Replace 800 with your desired target size in KB
      setOriginalImages(selectedImages);
      setReducedImages(reduced);
  
      // Calculate sizes for original images in KB
      const originalSizes = selectedImages.map((image) => {
        return (image.size / 1024).toFixed(2); // Convert bytes to KB and round to two decimal places
      });
  
      // Calculate sizes for reduced images in KB
      const reducedSizes = reduced.map((image) => {
        return (image.size / 1024).toFixed(2); // Convert bytes to KB and round to two decimal places
      });
  
      setOriginalSizeInKB(originalSizes);
      setReducedSizeInKB(reducedSizes);
    }
  };
  

  return (
    <div>
      {/* Input for single image */}
      <input type="file" accept="image/*" onChange={handleSingleImageReduction} />
      {originalImage && (
        <div>
          <img src={originalImage} alt="Original" />
          {originalSizeInKB && <p>Original Image Size: {originalSizeInKB} KB</p>}
        </div>
      )}
      {reducedImage && (
        <div>
          <img src={reducedImage} alt="Reduced" />
          {reducedSizeInKB && <p>Reduced Image Size: {reducedSizeInKB} KB</p>}
        </div>
      )}

      {/* Input for multiple images */}
      <input type="file" accept="image/*" multiple onChange={handleMultipleImagesReduction} />
      {originalImages.map((image, index) => (
        <div key={index}>
          <img src={URL.createObjectURL(image)} alt={`Original ${index}`} />
          {originalSizeInKB[index] && (
            <p>Original Image Size: {originalSizeInKB[index]} KB</p>
          )}
        </div>
      ))}
      {reducedImages.map((image, index) => (
        <div key={index}>
          <img src={URL.createObjectURL(image)} alt={`Reduced ${index}`} />
          {reducedSizeInKB[index] && (
            <p>Reduced Image Size: {reducedSizeInKB[index]} KB</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ImageResize;

