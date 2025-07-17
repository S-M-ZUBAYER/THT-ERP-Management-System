import { useEffect } from "react";
import toast from "react-hot-toast";
// import { axiosApi } from "@/lib/axiosApi";
// import useEmployeeStore from "@/Zustand/useEmployeeStore";
import { axiosApi } from "../lib/axiosApi";
import useEmployeeStore from "../Zustand/useEmployeeStore";

export const useEmployeeData = () => {
  const { adminData, setAdminData, userData, setUserData } = useEmployeeStore();

  useEffect(() => {
    if (adminData.flat().length === 0) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const res = await axiosApi.get("/users/getAllWithDeactivate");
      const data = res.data.result;
      const adminData = data.filter((user) => user.role === "Admin");
      const userData = data.filter((user) => user.role === "User");
      setAdminData(adminData);
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Failed to fetch employee data");
    }
  };

  return {
    adminData,
    userData,
    fetchData,
  };
};
