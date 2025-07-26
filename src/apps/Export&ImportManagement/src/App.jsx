import Layout from "./components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

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
