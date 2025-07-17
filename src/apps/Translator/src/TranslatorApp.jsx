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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

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
          <Route path="login" element={<LogIn />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default TranslatorApp;
