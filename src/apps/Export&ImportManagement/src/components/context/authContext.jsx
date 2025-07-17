import { createContext, useEffect, useState } from "react";

// Create a context for user authentication
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [financeDetailsData, setFinanceDetailsData] = useState({ finance: "finance" });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("values"));
    setUser(userData);
  }, []);

  const loginUser = (userEmail) => {
    localStorage.setItem("values", JSON.stringify(userEmail));
    setUser(userEmail);
  };
  const userID = (userId) => {
    localStorage.setItem("user", JSON.stringify(userId));
  };

  const logoutUser = () => {
    localStorage.removeItem("values");
    localStorage.removeItem("user");
    setUser(null);
    setUser(null);
  };



  return (
    <UserContext.Provider value={{ user, loginUser, userID, logoutUser, financeDetailsData, setFinanceDetailsData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
