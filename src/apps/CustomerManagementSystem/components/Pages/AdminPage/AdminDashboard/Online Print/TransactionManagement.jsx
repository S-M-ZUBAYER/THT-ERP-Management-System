import React, { useState } from "react";
import PlatformToggle from "./OnlinePrintComponent/PlatformToggle";
import TransactionManager from "./TransactionPaymentHistory/TransactionManager";

const TransactionManagement = () => {
  const [activePlatform, setActivePlatform] = useState("tiktok");
  const [platformLoading, setPlatformLoading] = useState({
    tiktok: false,
    shopee: false,
    lazada: false,
  });

  const handlePlatformChange = (platform) => {
    setPlatformLoading((prev) => ({ ...prev, [platform]: true }));
    setActivePlatform(platform);

    setTimeout(() => {
      setPlatformLoading((prev) => ({ ...prev, [platform]: false }));
    }, 300);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Transaction Management
          </h1>
          <p className="text-gray-600">
            View and manage payment transactions across platforms
          </p>
        </div>

        <div className="flex justify-center items-center mb-8">
          <div className="p-1 bg-slate-200 rounded-full flex shadow-inner">
            <PlatformToggle
              platform="tiktok"
              label="TikTok"
              isActive={activePlatform === "tiktok"}
              onClick={handlePlatformChange}
              loading={platformLoading.tiktok}
            />
            <PlatformToggle
              platform="shopee"
              label="Shopee"
              isActive={activePlatform === "shopee"}
              onClick={handlePlatformChange}
              loading={platformLoading.shopee}
            />
            <PlatformToggle
              platform="lazada"
              label="Lazada"
              isActive={activePlatform === "lazada"}
              onClick={handlePlatformChange}
              loading={platformLoading.lazada}
            />
          </div>
        </div>

        <TransactionManager platform={activePlatform} />
      </div>
    </div>
  );
};

export default TransactionManagement;
