import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useUserData } from "./hook/useUserData";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import EmployeePage from "./pages/EmployeePage";
import TaskPage from "./pages/TaskPage";
import BugManagement from "./pages/BugManagement";
import SingleTaskPage from "./pages/SingleTaskPage";
import TaskReport from "./pages/TaskReport";
import BugDetailsPage from "./pages/BugDetailsPage";
import SignInPage from "./pages/SignInPage";
import Animated404 from "./components/404";
import ReportsPage from "./pages/ReportsPage";
import AllProject from "./pages/AllProject";
import AllTask from "./pages/AllTask";

const AppLayout = () => (
  <div className="flex h-screen bg-white">
    <aside className="w-80 min-w-80 max-w-80 flex-shrink-0 h-screen border-[#F0E6FF] border-r p-6 flex flex-col justify-between overflow-x-hidden">
      <Sidebar />
    </aside>
    <div className="flex flex-col flex-1 min-w-0">
      <Navbar />
      <main className="p-6 overflow-y-auto custom-scrollbar min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  </div>
);
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUserData();

  if (loading) return null;
  if (!user) return <Navigate to="/task-management/sign-in" replace />;

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useUserData();

  if (loading) return null;
  if (user) return <Navigate to="/task-management" replace />;

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="all-project" element={<AllProject />} />
        <Route path="employees" element={<EmployeePage />} />
        <Route path="all-task" element={<AllTask />} />
        <Route path="tasks/:projectName" element={<TaskPage />} />
        <Route path="bugs" element={<BugManagement />} />
        <Route path="task-details/:id" element={<SingleTaskPage />} />
        <Route path="task-report" element={<TaskReport />} />
        <Route
          path="bug-details/:id/:bugProjectName"
          element={<BugDetailsPage />}
        />
        <Route path="Reports/:email/:name" element={<ReportsPage />} />
        <Route path="*" element={<Animated404 />} />
      </Route>

      <Route
        path="/sign-in"
        element={
          <PublicRoute>
            <SignInPage />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default App;
