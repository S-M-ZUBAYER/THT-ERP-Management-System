import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const DiscountDetails = () => {
  const [discountDetails, setDiscountDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { state } = useLocation();
  const discountId = state?.id;

  useEffect(() => {
    if (!discountId) return;

    const fetchSellerDetails = async () => {
      try {
        const response = await axios.get(
          `https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/segment-discounts/${discountId}`
        );
        const sellerData = response?.data?.data || [];
        setDiscountDetails(sellerData);
      } catch (error) {
        console.error("Error fetching seller details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerDetails();
  }, [discountId]);

  if (isLoading) {
    return (
      <CenteredMessage
        message="Loading seller details..."
        color="text-gray-600"
      />
    );
  }

  if (!discountDetails) {
    return (
      <CenteredMessage
        message="Seller details not found."
        color="text-red-500"
      />
    );
  }

  const fields = [
    { label: "Id", value: discountDetails.id },
    { label: "Title", value: discountDetails.title },
    { label: "Percentage", value: discountDetails.percentage },
    { label: "Segment Query", value: discountDetails.segmentQuery },
    {
      label: "minimum Amount",
      value: `$${discountDetails.minimumAmount || 0}`,
    },
    { label: "minimum Item", value: discountDetails.minimumItem },
    { label: "Coupon Code", value: discountDetails.code },
    { label: "Expire Date", value: discountDetails.expireDate },
    { label: "Tag", value: discountDetails.tag },
    { label: "Segment ID", value: discountDetails.segmentId },
    { label: "Discount ID", value: discountDetails.discountId },
    { label: "Created At", value: discountDetails.createdAt },
    { label: "Updated At", value: discountDetails.updatedAt },
  ];

  return (
    <div className="mx-auto mt-10 bg-white  p-6 px-20">
      <h2 className="text-2xl font-semibold text-[#004368] border-b pb-2 mb-6">
        Discount Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ label, value }) => (
          <DetailItem key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <p className="flex flex-col ">
    <span className="font-semibold text-[#004368] ">{label}:</span>
    <span className="border-[#D6E6F0] border-[0.1vw] rounded-[4px] p-2 text-[#00000099] ">
      {value ?? "-"}{" "}
    </span>
  </p>
);

const CenteredMessage = ({ message, color }) => (
  <div className="flex items-center justify-center h-screen">
    <p className={`text-lg ${color}`}>{message}</p>
  </div>
);

export default DiscountDetails;
