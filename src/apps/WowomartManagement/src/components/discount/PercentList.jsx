import { useState } from "react";
import axios from "axios";

export default function PercentList({ percents, onDelete }) {
  const [message, setMessage] = useState(null);

  const deletePercent = async (id) => {
    try {
      await axios.post(
        `https://grozziie.zjweiting.com:57683/tht/wowomart/api/discountPercent/delete/${id}`
      );
      onDelete();
      setMessage({ type: "success", text: `✅ Deleted percent` });
    } catch (err) {
      console.error("Failed to delete percent", err);
      setMessage({ type: "error", text: "❌ Failed to delete percent" });
    }
  };

  return (
    <div className="w-full md:w-[28vw] max-h-[50vh] overflow-y-auto space-y-1 custom-scrollbar">
      <h2 className="text-lg font-bold mb-4 text-[#004368]">
        Available Percent List
      </h2>

      {message && (
        <div
          className={`mb-4 text-sm p-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {percents.length === 0 ? (
        <p>No percents found.</p>
      ) : (
        <ul className="space-y-2">
          {percents.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center pl-2 pr-2 border rounded h-auto min-h-[40px]"
            >
              <span className="text-base text-[#004368]">{item.label}</span>
              <button
                onClick={() => deletePercent(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded flex items-center justify-center"
                style={{ backgroundColor: "#004368", color: "#ffffff" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
