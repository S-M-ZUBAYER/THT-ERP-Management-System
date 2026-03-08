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
    const email = urlParams.get("state");

    if (code && shopId) {
      console.log("🔐 Shopee Auth detected in App level");

      startLoading();

      const dynamicApiUrl = `https://grozziie.zjweiting.com:3091/shopee-open-shop/auth/dynamic?code=${code}&state=${shopId}`;

      const addShopApiUrl =
        "https://grozziieget.zjweiting.com:8033/tht/grozziiePrinter/shopee/shop/add";

      const shopData = {
        ShopeeUserEmail: email,
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
  }, []);

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
