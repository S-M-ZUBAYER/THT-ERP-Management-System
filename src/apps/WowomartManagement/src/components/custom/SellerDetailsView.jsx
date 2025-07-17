import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

// import handleToEmail from "@/lib/EmailSender";
// import { messageTemplate } from "@/lib/EmailSender";
import handleToEmail, { messageTemplate } from "../../lib/EmailSender";

export default function SellerDetailsView() {
  const [sellerDetails, setSellerDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);

  const location = useLocation();
  const sellerId = location.state?.id;

  useEffect(() => {
    if (!sellerId) return;

    fetchSellerDetails();
  }, [sellerId, refresh]);

  const fetchSellerDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://grozziieget.zjweiting.com:8033/tht/multiVendorInfo/${sellerId}`
      );

      const sellerData = data?.data || [];
      if (sellerData.length > 0) {
        setSellerDetails(sellerData[0]);
      } else {
        console.warn("Seller details not found in API response!");
      }
    } catch (error) {
      console.error("Failed to fetch seller details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountCreation = async (email, paymentId) => {
    try {
      await axios.put(
        `https://grozziieget.zjweiting.com:8033/tht/multiVendorPaymentInfo/accountCreationUpdate/${email}`
      );

      const subject = "Welcome! Your Seller Account Has Been Created";
      const message = messageTemplate(email, paymentId);
      const response = handleToEmail(email, subject, message);
      console.log(response);
      toast.success("Account creation status updated successfully.");
    } catch (error) {
      console.error(error.response?.data?.message || "Unknown error");
      toast.error("Failed to update account creation status.");
    }
  };

  const handleUpdateExpiredDate = async (email) => {
    try {
      const res = await axios.put(
        `https://grozziieget.zjweiting.com:8033/tht/multiVendorPaymentInfo/subscriptionStatusUpdate/${email}`,
        { subscriptionStatus: true }
      );
      console.log(res);
      toast.success("Subscription status updated successfully.");
      setRefresh(!refresh);
    } catch (error) {
      console.error(error.response?.data?.message || "Unknown error");
      toast.error("Failed to update subscription status.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading seller details...</p>
      </div>
    );
  }

  if (!sellerDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">Seller details not found.</p>
      </div>
    );
  }

  const {
    email,
    paymentId,
    Duration,
    paymentStatus,
    amount,
    paymentTime,
    currency,
    account_creation_status,
    purpose,
    subscriptionStatus,
  } = sellerDetails;

  return (
    <div className=" mx-auto bg-white  px-20 mt-10 ">
      <h2 className="text-2xl font-semibold text-[#004368] border-b pb-2 mb-4">
        Seller Details
      </h2>
      <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailItem label="Email" value={email} />
        <DetailItem label="Payment ID" value={paymentId} />
        <DetailItem label="Duration" value={Duration} />
        <DetailItem label="Payment Status" value={paymentStatus} />
        <DetailItem label="Amount" value={`$${amount || 0}`} />
        <DetailItem label="Payment Time" value={paymentTime} />
        <DetailItem label="Currency" value={currency} />
        <DetailItem
          label="Account Creation Status"
          value={account_creation_status}
        />
        <DetailItem label="Subscription Status" value={subscriptionStatus} />
        <DetailItem label="Purpose" value={purpose} />
      </div>
      <div className="w-full flex justify-end">
        {account_creation_status === 0 && (
          <button
            onClick={() => handleAccountCreation(email, paymentId)}
            className="bg-transparent hover:bg-blue-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            style={{ backgroundColor: "#004368", color: "white" }}
          >
            Create Account
          </button>
        )}

        {subscriptionStatus === 0 && account_creation_status === 1 && (
          <button
            onClick={() => handleUpdateExpiredDate(email)}
            className="bg-transparent hover:bg-blue-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Update Expired Date
          </button>
        )}
      </div>
    </div>
  );
}

const DetailItem = ({ label, value }) => (
  <p className=" flex flex-col">
    <span className="font-semibold text-[#004368] ">{label}:</span>
    <span className="border-[#D6E6F0] border-[0.1vw] rounded-[4px] p-2 text-[#00000099] ">
      {value}
    </span>
  </p>
);
