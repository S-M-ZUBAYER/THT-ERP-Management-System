import { createBrowserRouter } from "react-router-dom";
import Main from "../../Layout/Mainpage/Main";
import ErrorPage from "../../components/Pages/ErrorPage/ErrorPage";
import Home from "../../components/Pages/HomePage/Home";
import Admin from "../../components/Pages/AdminPage/Admin";
import Account from "../../components/Pages/Accountpage/Account";
import Contact from "../../components/Pages/ContactPage/Contact";
import Login from "../../components/Pages/LoginPage/Login";
import Register from "../../components/Pages/RegisterPage/Register";
import CustomerService_1 from "../../components/Pages/CustomerServicePage/CustomerService_1";
import CustomerService_2 from "../../components/Pages/CustomerServicePage/CustomerService_2";
import AllUsers from "../../components/Pages/AdminPage/AdminDashboard/AllUsers";
import QandA from "../../components/Pages/AdminPage/AdminDashboard/QandA";
import MallProducts from "../../components/Pages/AdminPage/AdminDashboard/MallProducts";
import EventProducts from "../../components/Pages/AdminPage/AdminDashboard/EventProducts";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import ProductDetails from "../../components/Pages/AdminPage/AdminDashboard/ProductDetails";
import AddProduct from "../../components/Pages/AdminPage/AdminDashboard/AddProduct";
import AfterSales from "../../components/Pages/AdminPage/AdminDashboard/ProductDetailsOutlet/AfterSales";
import AfterSalesInstruction from "../../components/Pages/AdminPage/AdminDashboard/ProductDetailsOutlet/AfterSalesInstruction";
import Inventory from "../../components/Pages/AdminPage/AdminDashboard/ProductDetailsOutlet/Inventory";
import Invoice from "../../components/Pages/AdminPage/AdminDashboard/ProductDetailsOutlet/Invoice";
import AdminDashboard from "../../components/Pages/AdminPage/AdminDashboard/AdminDashboard";
import Translator from "../../components/Pages/Translator/Translator";
import Detect from "../../components/Pages/Detect/Detect";
import AddBackgroundImg from "../../components/Pages/AdminPage/AdminDashboard/BackgroundImgPage/AddBackgroundImg";
import ShowBackgroundImg from "../../components/Pages/AdminPage/AdminDashboard/BackgroundImgPage/ShowBackgroundImg";
import AddIconImg from "../../components/Pages/AdminPage/AdminDashboard/IconImgPage/AddIconImg";
import ShowIconImg from "../../components/Pages/AdminPage/AdminDashboard/IconImgPage/ShowIconImg";
import WarehouseAndCities from "../../components/Pages/AdminPage/AdminDashboard/Warehouse&Cities.js/WarehouseAndCities";
import ShowCityList from "../../components/Pages/AdminPage/AdminDashboard/Warehouse&Cities.js/ShowCityList";
import ModelHightWidth from "../../components/Pages/AdminPage/AdminDashboard/ModelHightWidth/ModelHightWidth";
import ShowHightWidth from "../../components/Pages/AdminPage/AdminDashboard/ModelHightWidth/ShowHightWidth";
import AutomaticChat from "../../components/Pages/CustomerServicePage/AutomaticChat";
import ImageResize from "../../components/Pages/AdminPage/AdminDashboard/ImageResize";
import AddWifiModelHightWidth from "../../components/Pages/AdminPage/AdminDashboard/WifiModelHeightWidth/AddWifiModelInfo";
import AutomaticChat_CN from "../../components/Pages/CustomerServicePage/AutomaticChat_CN";
import ShopifyInfo from "../../components/Pages/AdminPage/AdminDashboard/ShopifyInfo";
import UserBaseBitmap from "../../components/Pages/AdminPage/UserBaseBitmap";
import ShowBitmap from "../../components/Pages/AdminPage/ShowBitmap";
import PDFPaymentInfo from "../../components/Pages/AdminPage/AdminDashboard/PDFPaymentInfo";
import VoltagePercentage from "../../components/Pages/AdminPage/AdminDashboard/PowerBank/VoltagePercentage";
import AddAdminBackgroundImg from "../../components/Pages/AdminPage/AdminDashboard/BackgroundImgPage/AddAdminBackgroundImg";
import ShowAdminBackgroundImg from "../../components/Pages/AdminPage/AdminDashboard/BackgroundImgPage/ShowAdminBackgroundImg";
import FaceAttendanceManage from "../../components/Pages/AdminPage/AdminDashboard/FaceAttendanceMange/FaceAttendanceManage";
import ChatbotUnknownQuestionManagement from "../../components/Pages/AdminPage/AdminDashboard/ChatbotUnknownQuestionManagement/ChatbotUnknownQuestionManagement";

export const routes = createBrowserRouter([
  {
    path: "/customer-management-system/",
    element: <Main></Main>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/customer-management-system/home",
        element: <Home></Home>,
      },
      {
        path: "/customer-management-system/customer-1",
        element: (
          <PrivateRoute>
            <AutomaticChat></AutomaticChat>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/chineseCustomer",
        element: (
          <PrivateRoute>
            <AutomaticChat_CN></AutomaticChat_CN>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/customer-2",
        element: (
          <PrivateRoute>
            <CustomerService_2></CustomerService_2>
          </PrivateRoute>
        ),
      },
      // {
      //     path:"/customer-management-system/admin",
      //     element:<Admin></Admin>
      // },
      {
        path: "account",
        element: (
          <PrivateRoute>
            <Account></Account>
          </PrivateRoute>
        ),
      },
      {
        path: "translator",
        element: (
          <PrivateRoute>
            <Translator></Translator>
          </PrivateRoute>
        ),
      },
      {
        path: "detect",
        element: (
          <PrivateRoute>
            <Detect></Detect>
          </PrivateRoute>
        ),
      },
      {
        path: "contact",
        element: <Contact></Contact>,
      },
      {
        path: "image",
        element: <ImageResize></ImageResize>,
      },
      {
        path: "login",
        element: <Login></Login>,
      },

      {
        path: "register",
        element: <Register></Register>,
      },
    ],
  },
  {
    path: "/customer-management-system/admin",
    element: (
      <PrivateRoute>
        <Admin></Admin>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/customer-management-system/admin/dashboard",
        element: (
          <PrivateRoute>
            <AdminDashboard></AdminDashboard>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/users",
        element: (
          <PrivateRoute>
            <AllUsers></AllUsers>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/questionAnswer",
        element: (
          <PrivateRoute>
            <QandA></QandA>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/warehouse&cities",
        element: (
          <PrivateRoute>
            <WarehouseAndCities></WarehouseAndCities>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/modelHightWidth",
        element: (
          <PrivateRoute>
            <ModelHightWidth></ModelHightWidth>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/wifiModelHightWidth",
        element: (
          <PrivateRoute>
            <AddWifiModelHightWidth></AddWifiModelHightWidth>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/modelInfo/:modelNo",
        element: (
          <PrivateRoute>
            <ShowHightWidth></ShowHightWidth>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/icon",
        element: (
          <PrivateRoute>
            <AddIconImg></AddIconImg>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/icon/:name",
        element: (
          <PrivateRoute>
            <ShowIconImg></ShowIconImg>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/cityName/:name",
        element: (
          <PrivateRoute>
            <ShowCityList></ShowCityList>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/backgroundImg",
        element: (
          <PrivateRoute>
            <AddBackgroundImg></AddBackgroundImg>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/adminBackgroundImg",
        element: (
          <PrivateRoute>
            <AddAdminBackgroundImg></AddAdminBackgroundImg>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/backgroundImg/:name",
        element: (
          <PrivateRoute>
            <ShowBackgroundImg></ShowBackgroundImg>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/adminBackgroundImg/:name",
        element: (
          <PrivateRoute>
            <ShowAdminBackgroundImg></ShowAdminBackgroundImg>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/mallProduct",
        element: (
          <PrivateRoute>
            <MallProducts></MallProducts>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/eventProduct",
        element: (
          <PrivateRoute>
            <EventProducts></EventProducts>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/shopifyInfo",
        element: (
          <PrivateRoute>
            <ShopifyInfo></ShopifyInfo>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/userBaseBitmap",
        element: (
          <PrivateRoute>
            <UserBaseBitmap></UserBaseBitmap>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/FaceAttendance",
        element: (
          <PrivateRoute>
            <FaceAttendanceManage></FaceAttendanceManage>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/OnlinePrint",
        element: (
          <PrivateRoute>
            <OnlinePrintManagement></OnlinePrintManagement>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/ChatBotManage",
        element: (
          <PrivateRoute>
            <ChatbotUnknownQuestionManagement></ChatbotUnknownQuestionManagement>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/powerBank",
        element: (
          <PrivateRoute>
            <VoltagePercentage></VoltagePercentage>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/userBaseBitmap/showBitmap/:userId",
        element: (
          <PrivateRoute>
            <ShowBitmap></ShowBitmap>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/mallProduct/details/:model",
        element: (
          <PrivateRoute>
            <ProductDetails></ProductDetails>
          </PrivateRoute>
        ),
        children: [
          {
            path: "/customer-management-system/admin/mallProduct/details/:model/afterSales",
            element: (
              <PrivateRoute>
                <AfterSales></AfterSales>
              </PrivateRoute>
            ),
          },
          {
            path: "/customer-management-system/admin/mallProduct/details/:model/inventory",
            element: (
              <PrivateRoute>
                <Inventory></Inventory>
              </PrivateRoute>
            ),
          },
          {
            path: "/customer-management-system/admin/mallProduct/details/:model/invoice",
            element: (
              <PrivateRoute>
                <Invoice></Invoice>
              </PrivateRoute>
            ),
          },
          {
            path: "/customer-management-system/admin/mallProduct/details/:model/instruction",
            element: (
              <PrivateRoute>
                <AfterSalesInstruction></AfterSalesInstruction>
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: "/customer-management-system/admin/eventProduct/details/:model",
        element: (
          <PrivateRoute>
            <ProductDetails></ProductDetails>
          </PrivateRoute>
        ),
        children: [
          {
            path: "/customer-management-system/admin/eventProduct/details/:model/afterSales",
            element: (
              <PrivateRoute>
                <AfterSales></AfterSales>
              </PrivateRoute>
            ),
          },
          {
            path: "/customer-management-system/admin/eventProduct/details/:model/inventory",
            element: (
              <PrivateRoute>
                <Inventory></Inventory>
              </PrivateRoute>
            ),
          },
          {
            path: "/customer-management-system/admin/eventProduct/details/:model/invoice",
            element: (
              <PrivateRoute>
                <Invoice></Invoice>
              </PrivateRoute>
            ),
          },
          {
            path: "/customer-management-system/admin/eventProduct/details/:model/instruction",
            element: (
              <PrivateRoute>
                <AfterSalesInstruction></AfterSalesInstruction>
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: "/customer-management-system/admin/mallProduct/add",
        element: (
          <PrivateRoute>
            <AddProduct></AddProduct>
          </PrivateRoute>
        ),
      },
      {
        path: "/customer-management-system/admin/eventProduct/add",
        element: (
          <PrivateRoute>
            <AddProduct></AddProduct>
          </PrivateRoute>
        ),
      },
    ],
  },
]);
