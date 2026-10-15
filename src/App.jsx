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
import { Toaster, toast } from "react-hot-toast";
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

      const wmsMatch = state?.match(/^WMS(\d+)\/(.+)$/i);
      const dynamicApiBaseUrl = wmsMatch
        ? "https://grozziie.zjweiting.com:3091/new-shopee-open-shop/auth/dynamic"
        // ? "http://192.168.1.125:9595/auth/dynamic"
        : "https://grozziie.zjweiting.com:3091/shopee-open-shop/auth/dynamic";
      const dynamicApiUrl = `${dynamicApiBaseUrl}?code=${encodeURIComponent(
        code
      )}&state=${encodeURIComponent(shopId)}`;

      if (wmsMatch) {
        const [, companyId, email] = wmsMatch;
        let shouldDelayRedirectForWarning = false;
        const wmsDebugKey = "shopeeWmsAuthDebugLog";
        const wmsLatestDebugKey = "shopeeWmsAuthDebugLatest";
        const incompleteAuthMessage =
          "Authorization properly not completed. Please authorization again.";
        const maskEmail = (value) => {
          if (!value) return "";
          const [name = "", domain = ""] = String(value).split("@");
          return domain
            ? `${name.slice(0, 2)}***@${domain}`
            : `${String(value).slice(0, 3)}***`;
        };
        const wmsDebugSession = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          startedAt: new Date().toISOString(),
          codePresent: Boolean(code),
          codeLength: code?.length || 0,
          shopId: String(shopId),
          stateMatched: true,
          companyId: String(companyId),
          email: maskEmail(email),
          steps: [],
        };
        const appendWmsDebug = (step, details = {}) => {
          const entry = {
            at: new Date().toISOString(),
            step,
            ...details,
          };

          wmsDebugSession.steps.push(entry);
          wmsDebugSession.updatedAt = entry.at;

          try {
            const previous = JSON.parse(
              window.localStorage.getItem(wmsDebugKey) || "[]"
            );
            const previousSessions = Array.isArray(previous) ? previous : [];
            const nextSessions = [
              wmsDebugSession,
              ...previousSessions.filter(
                (session) => session?.id !== wmsDebugSession.id
              ),
            ].slice(0, 10);

            window.localStorage.setItem(
              wmsDebugKey,
              JSON.stringify(nextSessions)
            );
            window.localStorage.setItem(
              wmsLatestDebugKey,
              JSON.stringify(wmsDebugSession)
            );
          } catch (storageError) {
            console.warn("Shopee WMS debug storage failed:", storageError);
          }

          console.log("[Shopee WMS Auth]", step, details);
        };
        const showIncompleteAuthWarning = (reason, details = {}) => {
          shouldDelayRedirectForWarning = true;
          appendWmsDebug("authorization-incomplete-warning-shown", {
            reason,
            ...details,
          });
          toast.error(incompleteAuthMessage);
        };
        const shopInfoApiUrl = `https://grozziie.zjweiting.com:3091/new-shopee-open-shop/api/dev/shop/shop-info?shopId=${encodeURIComponent(
        // const shopInfoApiUrl = `http://192.168.1.125:9595/api/dev/shop/shop-info?shopId=${encodeURIComponent(
          shopId
        )}`;
        const addPlatformStoreApiUrl =
          "https://grozziieget.zjweiting.com:8035/api/v1/platform-stores/public";
        const dynamicApiUrlForDebug = `${dynamicApiBaseUrl}?code=<redacted:${code?.length || 0}>&state=${encodeURIComponent(
          shopId
        )}`;
        appendWmsDebug("wms-flow-started", {
          dynamicApiUrl: dynamicApiUrlForDebug,
          shopInfoApiUrl,
          addPlatformStoreApiUrl,
        });
        const waitOneSecond = () =>
          new Promise((resolve) => setTimeout(resolve, 1000));
        const fetchDynamicAuthWithRetry = () => {
          appendWmsDebug("dynamic-auth-first-attempt-started", {
            stateSentToApi: String(shopId),
          });

          return fetch(dynamicApiUrl)
            .then((response) => {
              appendWmsDebug("dynamic-auth-first-attempt-response", {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
              });

              if (!response.ok) {
                throw new Error("Shopee dynamic auth failed");
              }

              return response;
            })
            .catch((error) => {
              appendWmsDebug("dynamic-auth-first-attempt-failed", {
                errorName: error?.name,
                errorMessage: error?.message,
              });
              console.error("Shopee dynamic auth failed, retrying WMS flow:", error);
              appendWmsDebug("dynamic-auth-retry-started", {
                stateSentToApi: String(shopId),
              });

              return fetch(dynamicApiUrl)
                .then((response) => {
                  appendWmsDebug("dynamic-auth-retry-response", {
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText,
                  });

                  if (!response.ok) {
                    throw new Error("Shopee dynamic auth retry failed");
                  }

                  return response;
                })
                .catch((retryError) => {
                  appendWmsDebug("dynamic-auth-retry-failed-continuing", {
                    errorName: retryError?.name,
                    errorMessage: retryError?.message,
                  });
                  console.error(
                    "Shopee dynamic auth retry failed, continuing WMS flow:",
                    retryError
                  );
                });
            });
        };

        fetchDynamicAuthWithRetry()
          .then(() => {
            appendWmsDebug("waiting-before-shop-info", {
              waitMs: 1000,
            });
            return waitOneSecond();
          })
          .then(() => {
            appendWmsDebug("shop-info-request-started");
            return fetch(shopInfoApiUrl);
          })
          .then((response) => {
            appendWmsDebug("shop-info-response", {
              ok: response.ok,
              status: response.status,
              statusText: response.statusText,
            });

            if (!response.ok) {
              throw new Error("Failed to fetch Shopee shop info");
            }

            return response.json();
          })
          .catch((error) => {
            appendWmsDebug("shop-info-failed-skipping-platform-store", {
              errorName: error?.name,
              errorMessage: error?.message,
            });
            showIncompleteAuthWarning("shop-info-request-failed", {
              errorName: error?.name,
              errorMessage: error?.message,
            });
            console.error("Shopee shop info failed, skipping platform store:", error);
            appendWmsDebug("platform-store-skipped", {
              reason: "shop-info-request-failed",
            });
            return { skippedPlatformStore: true };
          })
          .then((shopInfo) => {
            if (shopInfo?.skippedPlatformStore) {
              return shopInfo;
            }

            const hasShopName = Boolean(shopInfo?.shop_name);
            const hasRegion = Boolean(shopInfo?.region);

            if (!hasShopName || !hasRegion) {
              showIncompleteAuthWarning("shop-info-missing-required-data", {
                hasShopName,
                hasRegion,
              });
              appendWmsDebug("platform-store-skipped", {
                reason: "shop-info-missing-required-data",
              });

              return { skippedPlatformStore: true };
            }

            const shopName = String(shopInfo.shop_name);
            const platformStorePayload = {
              companyId: Number(companyId),
              platform: "shopee",
              storeName: shopName,
              externalStoreId: String(shopId),
              externalStoreName: shopName,
              storeShopId: String(shopId),
              storeOpenId: "",
              storeCipher: "",
              region: String(shopInfo.region),
              webhookSecret: "",
            };

            console.log(platformStorePayload, "shopInfo");
            appendWmsDebug("platform-store-request-started", {
              payload: {
                ...platformStorePayload,
                storeName:
                  shopName === email ? maskEmail(shopName) : platformStorePayload.storeName,
                externalStoreName:
                  shopName === email
                    ? maskEmail(shopName)
                    : platformStorePayload.externalStoreName,
              },
              shopInfoFound: Boolean(shopInfo?.shop_name),
            });

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
            if (response?.skippedPlatformStore) {
              return;
            }

            console.error(response,"response");
            appendWmsDebug("platform-store-response", {
              ok: response.ok,
              status: response.status,
              statusText: response.statusText,
            });

            if (!response.ok) {
              throw new Error("Failed to connect Shopee platform store");
            }
          })
          .catch((error) => {
            appendWmsDebug("wms-flow-failed", {
              errorName: error?.name,
              errorMessage: error?.message,
            });
            console.error("Shopee WMS auth flow failed:", error);
          })
          .finally(() => {
            appendWmsDebug("wms-flow-finished-redirecting", {
              redirectUrl: "https://printernoble.com/warehouse_management",
              delayedForWarning: shouldDelayRedirectForWarning,
            });
            stopLoading();
            setTimeout(
              () => {
                window.location.href =
                  "https://printernoble.com/warehouse_management";
              },
              shouldDelayRedirectForWarning ? 2000 : 0
            );
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
