// import { BrowserRouter as Router } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import AppRoutes from "./routes/AppRoutes";
// import UserContext from "./apps/CustomerManagementSystem/context/UserContext";
// import ProductContextProvider from "./apps/CustomerManagementSystem/context/ProductContext";

// function App() {
//   return (
//     <Router>
//       <UserContext>
//         <ProductContextProvider>
//           <Toaster />
//           <AppRoutes />
//         </ProductContextProvider>
//       </UserContext>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useRef } from "react";
import AppRoutes from "./routes/AppRoutes";
import UserContext from "./apps/CustomerManagementSystem/context/UserContext";
import ProductContextProvider from "./apps/CustomerManagementSystem/context/ProductContext";
import usePrinterAuthStore from "@/store/printerAuthStore";

function App() {
  const { printerAuthLoading, startLoading, stopLoading } =
    usePrinterAuthStore();

  // 🔐 Prevent double call in React StrictMode
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const shopId = urlParams.get("shop_id");
    const state = urlParams.get("state");

    if (code && shopId) {
      console.log("🔐 Shopee Auth detected in App level");

      startLoading();

      const dynamicApiUrl = `https://grozziie.zjweiting.com:3091/shopee-open-shop/auth/dynamic?code=${encodeURIComponent(
        code
      )}&state=${encodeURIComponent(shopId)}`;
      const wmsMatch = state?.match(/^WMS(\d+)\/(.+)$/i);

      if (wmsMatch) {
        const [, companyId, email] = wmsMatch;
        const shopInfoApiUrl = `http://192.168.1.222:8080/shopee-open-shop/api/dev/shop/shop-info?shopId=${encodeURIComponent(
          shopId
        )}`;
        const addPlatformStoreApiUrl =
          "https://grozziieget.zjweiting.com:8035/api/v1/platform-stores/public";

        fetch(dynamicApiUrl).catch((error) => {
          console.error("Shopee dynamic auth failed, continuing WMS flow:", error);
        });

        fetch(shopInfoApiUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch Shopee shop info");
            }

            return response.json();
          })
          .catch((error) => {
            console.error("Shopee shop info failed, continuing with fallback:", error);
            return {};
          })
          .then((shopInfo) => {
            const shopName = String(shopInfo?.shop_name || email);
            const platformStorePayload = {
              companyId: Number(companyId),
              platform: "shopee",
              storeName: shopName,
              externalStoreId: String(shopId),
              externalStoreName: shopName,
              storeShopId: String(shopId),
              storeOpenId: "",
              storeCipher: "",
              region: String(shopInfo?.region || "SG"),
              webhookSecret: "",
            };

            console.log(platformStorePayload, "shopInfo");

            return fetch(addPlatformStoreApiUrl, {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(platformStorePayload),
            });
          })
          .then((response) => {
             console.error(response,"response");
            if (!response.ok) {
              throw new Error("Failed to connect Shopee platform store");
            }
          })
          .catch((error) => {
            console.error("Shopee WMS auth flow failed:", error);
          })
          .finally(() => {
            stopLoading();
            window.location.href = "https://printernoble.com/warehouse_management";
          });

        return;
      }

      const addShopApiUrl =
        "https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/shopee/shop/add";

      const shopData = {
        ShopeeUserEmail: state,
        ShopCountry: "MY",
        ShopeeAPPKey: shopId,
        active: true,
      };

      const fetchDynamic = fetch(dynamicApiUrl);
      const addShop = fetch(addShopApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shopData),
      });

      Promise.allSettled([fetchDynamic, addShop]).finally(() => {
        stopLoading();
        window.location.href = "https://printernoble.com/onlineprint/";
      });
    }
  }, [startLoading, stopLoading]);

  // ✅ Show full screen loader BEFORE Router
  if (printerAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 text-lg font-semibold">
          Connecting Shopee shop, please wait...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <UserContext>
        <ProductContextProvider>
          <Toaster />
          <AppRoutes />
        </ProductContextProvider>
      </UserContext>
    </Router>
  );
}

export default App;
