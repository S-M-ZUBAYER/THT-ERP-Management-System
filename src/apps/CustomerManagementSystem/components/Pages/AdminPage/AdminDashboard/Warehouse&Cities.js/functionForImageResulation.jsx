import React from 'react';

function reduceImageResolution(image, targetSizeInKB) {
  console.log(image,"image")
  return new Promise((resolve) => {
    const maxSize = targetSizeInKB * 1024; // Convert target size to bytes

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate the new dimensions while maintaining the aspect ratio
        let newWidth = img.width;
        let newHeight = img.height;

        let sizeInBytes = newWidth * newHeight * 4; // 4 bytes per pixel

        // Reduce resolution until the image is under the target size
        while (sizeInBytes > maxSize) {
          newWidth = newWidth * 0.9;
          newHeight = (newWidth * img.height) / img.width;
          sizeInBytes = newWidth * newHeight * 4;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert the canvas to a new image
        canvas.toBlob((blob) => {
          const reducedImage = new File([blob], 'reduced_image.jpg', { type: 'image/jpeg' });
          resolve(reducedImage);
        }, 'image/jpeg', 0.7); // Adjust the image quality if needed
      };
    };
    reader.readAsDataURL(image);
  });
}

function reduceImagesResolution(images, targetSizeInKB) {
  console.log(typeof(images),images,"images")
  const promises = images && images.length>0 && images.map((image) => reduceImageResolution(image, targetSizeInKB));
  console.log("next")
  return Promise.all(promises);
}

export { reduceImageResolution, reduceImagesResolution };
