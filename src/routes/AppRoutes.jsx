// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import App from "@/apps/TaskManagement/src/App";
import WowomartApp from "@/apps/WowomartManagement/src/App";
// import ExportImportApp from "@/apps/ExportImportManagement/src/routers/Routers.jsx";
import ExportImportApp from "../apps/Export&ImportManagement/src/App";
import TranslatorApp from "../apps/Translator/src/TranslatorApp"; // ✅ default import now

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/task-management/*" element={<App />} />
      <Route path="/wowomart-management/*" element={<WowomartApp />} />
      <Route path="/export-import/*" element={<ExportImportApp />} />
      <Route path="/translator/*" element={<TranslatorApp />} />
      <Route
        path="*"
        element={<div>Page not found. Please check the URL.</div>}
      />
    </Routes>
  );
};

export default AppRoutes;
