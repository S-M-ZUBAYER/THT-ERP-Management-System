import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import InputField from "./InputField";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://grozziieget.zjweiting.com:8033/tht/wowomart/api";

export default function UpdateSellerInfo() {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const { state } = useLocation();
  const sellerId = state?.id || "";
  const route = state?.route || "";

  useEffect(() => {
    if (!sellerId) return;

    const fetchSellerDetails = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/multiVendorInfo/${sellerId}`
        );
        const seller = data?.data?.[0] || data;

        if (!seller) {
          setFeedback({ type: "error", text: "Seller not found." });
          return;
        }

        const paymentTime = new Date(seller.paymentTime)
          .toISOString()
          .replace("T", " ")
          .slice(0, 19);

        setFormData({
          ...seller,
          paymentTime,
          duration: seller.Duration, // Normalize for display
        });
      } catch (err) {
        console.error("Error fetching seller data:", err);
        setFeedback({ type: "error", text: "Unable to load seller details." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerDetails();
  }, [sellerId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    try {
      console.log(formData);
      const response = await axios.put(
        `${API_BASE_URL}/multiVendorPaymentInfo/update`,
        formData
      );
      console.log("Update successful:", response);
      setFeedback({
        type: "success",
        text: "Seller information updated successfully.",
      });
    } catch (err) {
      console.error("Update failed:", err.response || err);
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to update seller info.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading seller details...
      </div>
    );
  }

  return (
    <div className=" mx-auto mt-10 p-6 bg-white px-20">
      <h2 className="text-2xl font-semibold text-[#004368] mb-4 border-b pb-2">
        Edit details
      </h2>

      {feedback && (
        <div
          className={`p-2 mb-4 rounded text-white ${
            feedback.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <InputField
          label="Email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
        />
        <InputField
          label="Payment ID"
          name="paymentId"
          value={formData.paymentId || ""}
          onChange={handleChange}
        />
        <InputField
          label="Duration"
          name="Duration"
          value={formData.Duration || ""}
          onChange={handleChange}
        />
        <InputField
          label="Payment Status"
          name="paymentStatus"
          value={formData?.paymentStatus?.toString() || ""}
          onChange={handleChange}
        />
        <InputField
          label="Amount"
          name="amount"
          value={formData.amount || ""}
          onChange={handleChange}
        />
        <InputField
          label="Payment Time"
          name="paymentTime"
          value={formData.paymentTime || ""}
          onChange={handleChange}
        />
        <InputField
          label="Currency"
          name="currency"
          value={formData.currency || ""}
          onChange={handleChange}
        />
        <InputField
          label="Account Creation Status"
          name="account_creation_status"
          value={formData?.account_creation_status?.toString() || ""}
          onChange={handleChange}
        />
        <InputField
          label="Purpose"
          name="purpose"
          value={formData.purpose || ""}
          onChange={handleChange}
        />
        <InputField
          label="Subscription Status"
          name="subscriptionStatus"
          value={formData.subscriptionStatus?.toString() || ""}
          onChange={handleChange}
        />

        <div className="sm:col-span-2 flex justify-end gap-5 items-center">
          <Button
            style={{
              backgroundColor: "white",
              border: "1.5px solid #004368",
              color: "#004368",
              height: "44px",
              width: "150px",
            }}
            onClick={() => navigate(route, { replace: true })}
          >
            cancel
          </Button>
          <button
            type="submit"
            className=" text-white py-2 rounded transition duration-300"
            style={{ backgroundColor: "#004368" }}
          >
            Update Seller
          </button>
        </div>
      </form>
    </div>
  );
}
