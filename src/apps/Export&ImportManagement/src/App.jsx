import Layout from "./components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./App.css";
// import ChatComponent from "./pages/Dashboard/ChatComponent";

function App() {
  return (
    <>
      <ToastContainer />
      <Layout />
      {/* <ChatComponent /> */}
    </>
  );
}

export default App;
