// import { useUserStore } from "@/Zustand/useUserStore";
import { useEffect, useState } from "react";
import { useUserStore } from "../Zustand/useUserStore";

export const useUserData = () => {
  const { admin, setAdmin, user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.role === "Admin") {
          setAdmin(true);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, [setUser, setAdmin]);

  return {
    admin,
    user,
    loading,
  };
};
