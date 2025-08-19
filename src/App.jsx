import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import UserContext from "./apps/CustomerManagementSystem/context/UserContext";
import ProductContextProvider from "./apps/CustomerManagementSystem/context/ProductContext";

function App() {
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
