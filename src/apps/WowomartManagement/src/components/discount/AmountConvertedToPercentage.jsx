import { useState } from "react";

export default function AmountConvertedToPercentage() {
  const [productPrice, setProductPrice] = useState("");
  const [fixedDiscount, setFixedDiscount] = useState("");
  const [result, setResult] = useState("");

  const convertToPercentage = () => {
    const price = parseFloat(productPrice);
    const discount = parseFloat(fixedDiscount);

    if (isNaN(price) || isNaN(discount) || price <= 0) {
      setResult("Please enter valid positive numbers.");
      return;
    }

    const percentage = ((discount / price) * 100).toFixed(2);
    setResult(`Discount is ${percentage}% of the product price.`);
  };

  return (
    <div className="w-full max-w-[500px] mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md space-y-4 border border-gray-200">
      <h2 className="text-lg font-bold text-[#004368]">
        Discount Percentage Calculator
      </h2>

      <div>
        <label className="block text-lg font-semibold text-[#004368] mb-1">
          Product Price
        </label>
        <input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="Enter product price"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-lg font-semibold text-[#004368] mb-1">
          Fixed Discount Amount
        </label>
        <input
          type="number"
          value={fixedDiscount}
          onChange={(e) => setFixedDiscount(e.target.value)}
          placeholder="Enter fixed discount"
          className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="w-full">
        <button
          onClick={convertToPercentage}
          className="w-full bg-[#004368] hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          style={{ backgroundColor: "#004368", color: "#ffffff" }}
        >
          Convert to Percentage
        </button>
      </div>

      {result && (
        <div
          className={`mt-4 text-center text-lg font-medium ${
            result.includes("Please") ? "text-red-600" : "text-green-600"
          }`}
        >
          {result}
        </div>
      )}
    </div>
  );
}
