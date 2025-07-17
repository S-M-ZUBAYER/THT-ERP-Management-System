const generateRandomCoupon = () => {
  const base = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return {
    tag: `${timestamp}${base}`,
    code: `${base}${timestamp}`,
  };
};

export default generateRandomCoupon;
