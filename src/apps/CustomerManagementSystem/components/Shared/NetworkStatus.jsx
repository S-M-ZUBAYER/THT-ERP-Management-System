import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../App";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { SocketDisconnect, connect, userInfo } = useContext(AuthContext);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      connect();
    };

    const handleOffline = () => {
      setIsOnline(false);
      SocketDisconnect();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-around">
        <div className="flex items-center gap-1">
          {userInfo?.image ? (
            <img
              className={`rounded-full h-8 w-8 border-2 ${
                isOnline ? "border-green-700" : "border-red-700"
              }`}
              src={userInfo.image}
              alt="User Avatar"
            />
          ) : (
            <img
              className={`rounded-full h-8 w-8 border-2 ${
                isOnline ? "border-green-700" : "border-red-700"
              }`}
              src="data:image/png;base64,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"
              alt="Default Avatar"
            />
          )}
          <p
            className={`${
              isOnline ? "text-green-700" : "text-red-700"
            } font-semibold`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </>
  );
};

export default NetworkStatus;
