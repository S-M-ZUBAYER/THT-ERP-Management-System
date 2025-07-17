const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const cleanedBase64 = base64String.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      resolve(cleanedBase64);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export default imageToBase64;
