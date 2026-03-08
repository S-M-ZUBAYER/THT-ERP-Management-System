// import logo from "./logo.svg";
// import "./App.css";
// import { RouterProvider } from "react-router-dom";
// import { routes } from "./Routes/Routes/Routes";
// import { useContext, useEffect } from "react";
// import { AuthContext } from "./context/UserContext";
// import {
//   deleteAllChatsFromDB,
//   manageDeleteChatsInDB,
// } from "./components/Pages/CustomerServicePage/indexedDB";

// function App() {
//   const { SocketDisconnect, setUser } = useContext(AuthContext);

//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       localStorage.removeItem("user");
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);

//   window.addEventListener("message", (event) => {
//     console.log(event.origin, "origin");
//     if (event.origin !== "https://grozziie.zjweiting.com:57609") {
//       console.warn("Blocked message from unauthorized origin:", event.origin);
//       return;
//     }
//     const { user } = event.data;
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//       setUser(user);
//     }
//   });

//   useEffect(() => {
//     const handleBeforeUnload = async (event) => {
//       event.preventDefault();
//       event.returnValue = ""; // Some browsers require this for custom messages
//       SocketDisconnect();
//       console.log("Site is closing...");
//       await manageDeleteChatsInDB();
//       await deleteAllChatsFromDB();
//       localStorage.removeItem("viewedBitmapUserIds");
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);

//   return (
//     <div className="App lg:mx-0 xl:mx-20  2xl:mx-32 bg-white">
//       <RouterProvider router={routes}></RouterProvider>
//     </div>
//   );
// }

// export default App;

// src/apps/CustomerManagementSystem/App.jsx
import React, { createContext, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import {
  deleteAllChatsFromDB,
  manageDeleteChatsInDB,
} from "./components/Pages/CustomerServicePage/indexedDB";

// Layout & Pages
import Main from "./Layout/Mainpage/Main";
import ErrorPage from "../../apps/WowomartManagement/src/components/custom/404";
import Home from "./components/Pages/HomePage/Home";
import Admin from "./components/Pages/AdminPage/Admin";
import Account from "./components/Pages/Accountpage/Account";
import Contact from "./components/Pages/ContactPage/Contact";
import Login from "./components/Pages/LoginPage/Login";
import Register from "./components/Pages/RegisterPage/Register";
import CustomerService_1 from "./components/Pages/CustomerServicePage/CustomerService_1";
import CustomerService_2 from "./components/Pages/CustomerServicePage/CustomerService_2";
import AutomaticChat from "./components/Pages/CustomerServicePage/AutomaticChat";
import AutomaticChat_CN from "./components/Pages/CustomerServicePage/AutomaticChat_CN";
import Translator from "./components/Pages/Translator/Translator";
import Detect from "./components/Pages/Detect/Detect";

// Admin dashboard pages
import AdminDashboard from "./components/Pages/AdminPage/AdminDashboard/AdminDashboard";
import AllUsers from "./components/Pages/AdminPage/AdminDashboard/AllUsers";
import QandA from "./components/Pages/AdminPage/AdminDashboard/QandA";
import MallProducts from "./components/Pages/AdminPage/AdminDashboard/MallProducts";
import EventProducts from "./components/Pages/AdminPage/AdminDashboard/EventProducts";
import ProductDetails from "./components/Pages/AdminPage/AdminDashboard/ProductDetails";
import AfterSales from "./components/Pages/AdminPage/AdminDashboard/ProductDetailsOutlet/AfterSales";
import AfterSalesInstruction from "./components/Pages/AdminPage/AdminDashboard/ProductDetailsOutlet/AfterSalesInstruction";
import Inventory from "./components/Pages/AdminPage/AdminDashboard/ProductDetailsOutlet/Inventory";
import Invoice from "./components/Pages/AdminPage/AdminDashboard/ProductDetailsOutlet/Invoice";
import AddProduct from "./components/Pages/AdminPage/AdminDashboard/AddProduct";

// Example of other admin pages
import WarehouseAndCities from "./components/Pages/AdminPage/AdminDashboard/Warehouse&Cities.js/WarehouseAndCities";
import ModelHightWidth from "./components/Pages/AdminPage/AdminDashboard/ModelHightWidth/ModelHightWidth";
import AddWifiModelHightWidth from "./components/Pages/AdminPage/AdminDashboard/WifiModelHeightWidth/AddWifiModelInfo";
import ShowHightWidth from "./components/Pages/AdminPage/AdminDashboard/ModelHightWidth/ShowHightWidth";
import AddIconImg from "./components/Pages/AdminPage/AdminDashboard/IconImgPage/AddIconImg";
import ShowIconImg from "./components/Pages/AdminPage/AdminDashboard/IconImgPage/ShowIconImg";
import ShowCityList from "./components/Pages/AdminPage/AdminDashboard/Warehouse&Cities.js/ShowCityList";
import AddBackgroundImg from "./components/Pages/AdminPage/AdminDashboard/BackgroundImgPage/AddBackgroundImg";
import ShowBackgroundImg from "./components/Pages/AdminPage/AdminDashboard/BackgroundImgPage/ShowBackgroundImg";
import AddAdminBackgroundImg from "./components/Pages/AdminPage/AdminDashboard/BackgroundImgPage/AddAdminBackgroundImg";
import ShowAdminBackgroundImg from "./components/Pages/AdminPage/AdminDashboard/BackgroundImgPage/ShowAdminBackgroundImg";
import ShopifyInfo from "./components/Pages/AdminPage/AdminDashboard/ShopifyInfo";
import UserBaseBitmap from "./components/Pages/AdminPage/UserBaseBitmap";
import ShowBitmap from "./components/Pages/AdminPage/ShowBitmap";
import VoltagePercentage from "./components/Pages/AdminPage/AdminDashboard/PowerBank/VoltagePercentage";
import ImageResize from "./components/Pages/AdminPage/AdminDashboard/ImageResize";

// PrivateRoute wrapper
import PrivateRoute from "./Routes/Routes/PrivateRoute/PrivateRoute";
import FaceAttendanceManage from "./components/Pages/AdminPage/AdminDashboard/FaceAttendanceMange/FaceAttendanceManage";
import OnlinePrintManagement from "./components/Pages/AdminPage/AdminDashboard/Online Print/OnlinePrintManagement";
import ChatbotUnknownQuestionManagement from "./components/Pages/AdminPage/AdminDashboard/ChatbotUnknownQuestionManagement/ChatbotUnknownQuestionManagement";

// ✅ Auth Context
export const AuthContext = createContext();

const CustomerManagementSystemApp = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const SocketDisconnect = () => {
    console.log("Socket disconnected ✅");
  };

  // Load stored user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }
    setLoading(false);
  }, []);

  // Listen for postMessage updates
  useEffect(() => {
    const messageHandler = (event) => {
      if (event.origin !== "https://grozziie.zjweiting.com:57609") return;
      const { user } = event.data;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }
    };
    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  // Cleanup on unload
  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      event.preventDefault();
      event.returnValue = "";
      SocketDisconnect();
      await manageDeleteChatsInDB();
      await deleteAllChatsFromDB();
      localStorage.removeItem("viewedBitmapUserIds");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const authInfo = { user, setUser, loading, setLoading, SocketDisconnect };

  return (
    <AuthContext.Provider value={authInfo}>
      <div className="App lg:mx-0 xl:mx-20  2xl:mx-32 bg-white ">
        <Routes>
          {/* Main layout */}
          <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/customer-1"
              element={
                <PrivateRoute>
                  <AutomaticChat />
                </PrivateRoute>
              }
            />
            <Route
              path="chineseCustomer"
              element={
                <PrivateRoute>
                  <AutomaticChat_CN />
                </PrivateRoute>
              }
            />
            <Route
              path="customer-2"
              element={
                <PrivateRoute>
                  <CustomerService_2 />
                </PrivateRoute>
              }
            />
            <Route
              path="account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              path="translator"
              element={
                <PrivateRoute>
                  <Translator />
                </PrivateRoute>
              }
            />
            <Route
              path="detect"
              element={
                <PrivateRoute>
                  <Detect />
                </PrivateRoute>
              }
            />
            <Route path="contact" element={<Contact />} />
            <Route path="image" element={<ImageResize />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          >
            <Route
              path="dashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="users"
              element={
                <PrivateRoute>
                  <AllUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="questionAnswer"
              element={
                <PrivateRoute>
                  <QandA />
                </PrivateRoute>
              }
            />
            <Route
              path="warehouse&cities"
              element={
                <PrivateRoute>
                  <WarehouseAndCities />
                </PrivateRoute>
              }
            />
            <Route
              path="modelHightWidth"
              element={
                <PrivateRoute>
                  <ModelHightWidth />
                </PrivateRoute>
              }
            />
            <Route
              path="wifiModelHightWidth"
              element={
                <PrivateRoute>
                  <AddWifiModelHightWidth />
                </PrivateRoute>
              }
            />
            <Route
              path="modelInfo/:modelNo"
              element={
                <PrivateRoute>
                  <ShowHightWidth />
                </PrivateRoute>
              }
            />
            <Route
              path="icon"
              element={
                <PrivateRoute>
                  <AddIconImg />
                </PrivateRoute>
              }
            />
            <Route
              path="icon/:name"
              element={
                <PrivateRoute>
                  <ShowIconImg />
                </PrivateRoute>
              }
            />
            <Route
              path="cityName/:name"
              element={
                <PrivateRoute>
                  <ShowCityList />
                </PrivateRoute>
              }
            />
            <Route
              path="backgroundImg"
              element={
                <PrivateRoute>
                  <AddBackgroundImg />
                </PrivateRoute>
              }
            />
            <Route
              path="adminBackgroundImg"
              element={
                <PrivateRoute>
                  <AddAdminBackgroundImg />
                </PrivateRoute>
              }
            />
            <Route
              path="backgroundImg/:name"
              element={
                <PrivateRoute>
                  <ShowBackgroundImg />
                </PrivateRoute>
              }
            />
            <Route
              path="adminBackgroundImg/:name"
              element={
                <PrivateRoute>
                  <ShowAdminBackgroundImg />
                </PrivateRoute>
              }
            />
            <Route
              path="mallProduct"
              element={
                <PrivateRoute>
                  <MallProducts />
                </PrivateRoute>
              }
            />
            <Route
              path="eventProduct"
              element={
                <PrivateRoute>
                  <EventProducts />
                </PrivateRoute>
              }
            />
            <Route
              path="shopifyInfo"
              element={
                <PrivateRoute>
                  <ShopifyInfo />
                </PrivateRoute>
              }
            />
            <Route
              path="userBaseBitmap"
              element={
                <PrivateRoute>
                  <UserBaseBitmap />
                </PrivateRoute>
              }
            />
            <Route
              path="FaceAttendance"
              element={
                <PrivateRoute>
                  <FaceAttendanceManage />
                </PrivateRoute>
              }
            />
            <Route
              path="OnlinePrint"
              element={
                <PrivateRoute>
                  <OnlinePrintManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="ChatBotManage"
              element={
                <PrivateRoute>
                  <ChatbotUnknownQuestionManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="powerBank"
              element={
                <PrivateRoute>
                  <VoltagePercentage />
                </PrivateRoute>
              }
            />
            <Route
              path="userBaseBitmap/showBitmap/:userId"
              element={
                <PrivateRoute>
                  <ShowBitmap />
                </PrivateRoute>
              }
            />

            {/* Product details nested */}
            <Route
              path="mallProduct/details/:model"
              element={
                <PrivateRoute>
                  <ProductDetails />
                </PrivateRoute>
              }
            >
              <Route
                path="afterSales"
                element={
                  <PrivateRoute>
                    <AfterSales />
                  </PrivateRoute>
                }
              />
              <Route
                path="inventory"
                element={
                  <PrivateRoute>
                    <Inventory />
                  </PrivateRoute>
                }
              />
              <Route
                path="invoice"
                element={
                  <PrivateRoute>
                    <Invoice />
                  </PrivateRoute>
                }
              />
              <Route
                path="instruction"
                element={
                  <PrivateRoute>
                    <AfterSalesInstruction />
                  </PrivateRoute>
                }
              />
            </Route>

            <Route
              path="eventProduct/details/:model"
              element={
                <PrivateRoute>
                  <ProductDetails />
                </PrivateRoute>
              }
            >
              <Route
                path="afterSales"
                element={
                  <PrivateRoute>
                    <AfterSales />
                  </PrivateRoute>
                }
              />
              <Route
                path="inventory"
                element={
                  <PrivateRoute>
                    <Inventory />
                  </PrivateRoute>
                }
              />
              <Route
                path="invoice"
                element={
                  <PrivateRoute>
                    <Invoice />
                  </PrivateRoute>
                }
              />
              <Route
                path="instruction"
                element={
                  <PrivateRoute>
                    <AfterSalesInstruction />
                  </PrivateRoute>
                }
              />
            </Route>

            <Route
              path="mallProduct/add"
              element={
                <PrivateRoute>
                  <AddProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="eventProduct/add"
              element={
                <PrivateRoute>
                  <AddProduct />
                </PrivateRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
};

export default CustomerManagementSystemApp;
