// import "./App.css";
// import React from "react";
// import "react-toastify/dist/ReactToastify.css";
// import Translator from "./component/Translator/Translator";
// import { RouterProvider } from "react-router-dom";
// import { Routes } from "./Routes/Routes";
// import { ToastContainer } from "react-toastify";

// function App() {
//   return (
//     <div className="App lg:mx-0 xl:mx-20  2xl:mx-32 bg-white">
//       {/* <Translator></Translator> */}
//       <ToastContainer></ToastContainer>
//       {/* <RouterProvider router={Routes}> */}

//       {/* </RouterProvider> */}
//     </div>
//   );
// }

// export default App;

// TranslatorApp.jsx
// apps/Translator/src/TranslatorApp.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Translator from "./component/Translator/Translator";
import LogIn from "./component/LogIn/LogIn";
import Main from "./component/Main/Main";
import ErrorPage from "./component/ErrorPage/ErrorPage";
import PrivateRoute from "./component/PrivateRoute/PrivateRoute";
import Navbar from "@/pages/SharedPage/Navbar";
import ChatbotUnknownQuestionManagement from "@/apps/CustomerManagementSystem/components/Pages/AdminPage/AdminDashboard/ChatbotUnknownQuestionManagement/ChatbotUnknownQuestionManagement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/apps/CustomerManagementSystem/components/Shared/responsive-container.css";
import "./App.css";

const ChatbotManagementPage = () => (
  <div className="min-h-screen responsive-container bg-white text-gray-800 flex flex-col items-center px-6 py-10">
    <Navbar />
    <div className="w-full">
      <ChatbotUnknownQuestionManagement allowDelete={false} />
    </div>
  </div>
);

const TranslatorApp = () => {
  return (
    <div className="App lg:mx-0 xl:mx-20 2xl:mx-32 bg-white">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Main />}>
          <Route
            index
            element={
              <PrivateRoute>
                <Translator />
              </PrivateRoute>
            }
          />
          <Route
            path="chatbot-management"
            element={
              <PrivateRoute>
                <ChatbotManagementPage />
              </PrivateRoute>
            }
          />
          <Route path="login" element={<LogIn />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default TranslatorApp;
