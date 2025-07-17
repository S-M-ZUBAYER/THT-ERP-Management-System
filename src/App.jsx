// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./apps/Export&ImportManagement/src/components/context/authContext";

function App() {
  return (
    <Router>
      <UserProvider>
        <Toaster />
        <AppRoutes />
      </UserProvider>
    </Router>
  );
}

export default App;
