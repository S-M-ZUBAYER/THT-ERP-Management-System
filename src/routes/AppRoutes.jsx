// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
// import Dashboard from "../pages/Dashboard";
import Dashboard from "../pages/DashboardPage/Dashboard";
import TaskmanagementApp from "@/apps/TaskManagement/src/App";
import WowomartApp from "@/apps/WowomartManagement/src/App";
import ExportImportApp from "../apps/Export&ImportManagement/src/App";
import TranslatorApp from "../apps/Translator/src/TranslatorApp";
import AttendanceShiftingApp from "../apps/AttendanceShifting/App";
import Animated404 from "@/apps/TaskManagement/src/components/404";
import CustomerManagementSystemApp from "@/apps/CustomerManagementSystem/App";
import Contact from "@/pages/Contact";
import Setting from "@/pages/SettingPage/Setting";
import Register from "@/pages/Register";
import MainPrivateRoute from "@/pages/SharedPage/MainPrivateRoute";
import SettingPrivateRoute from "@/pages/SharedPage/SettingPrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainPrivateRoute>
            <Dashboard />
          </MainPrivateRoute>
        }
      />
      <Route path="/logIn" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Home" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/settings"
        element={
          <MainPrivateRoute>
            <SettingPrivateRoute>
              <Setting />
            </SettingPrivateRoute>
          </MainPrivateRoute>
        }
      />
      <Route path="/contact" element={<Contact />} />
      <Route path="/task-management/*" element={<TaskmanagementApp />} />
      <Route path="/wowomart-management/*" element={<WowomartApp />} />
      <Route path="/export-import/*" element={<ExportImportApp />} />
      <Route path="/translator/*" element={<TranslatorApp />} />
      <Route
        path="/attendance-shifting/*"
        element={<AttendanceShiftingApp />}
      />
      <Route
        path="/customer-management-system/*"
        element={<CustomerManagementSystemApp />}
      />
      <Route path="*" element={<Animated404 />} />
    </Routes>
  );
};

export default AppRoutes;
