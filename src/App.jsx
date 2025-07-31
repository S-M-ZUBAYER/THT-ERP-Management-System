import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <Toaster />
      <AppRoutes />
    </Router>
  );
}

export default App;
