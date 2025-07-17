import { useEffect, useRef } from "react";
import { useUserData } from "./useUserData";
// import { useNotificationStore } from "@/Zustand/useNotificationStore";
import notificationSound from "../assets/notification.mp3";
// import { axiosApi } from "@/lib/axiosApi";
import { useNotificationStore } from "../Zustand/useNotificationStore";
import { axiosApi } from "../lib/axiosApi";

export const useWebSocket = () => {
  const socketRef = useRef(null);
  const { user } = useUserData();
  const { messages, addMessage, setMessages } = useNotificationStore();

  const getNotification = async () => {
    try {
      const res = await axiosApi.get(`/notification/${user.id}`);
      if (res.data.data && res.data.data.length > 0) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching notification:", error);
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      getNotification();
    }
  }, []);

  useEffect(() => {
    if (!user?.id || !user?.role) return;

    socketRef.current = new WebSocket("wss://grozziie.zjweiting.com:57683");

    socketRef.current.onopen = () => {
      socketRef.current.send(
        JSON.stringify({
          type: "register",
          userId: `${user.id}`,
          role: user.role,
        })
      );
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const sound = new Audio(notificationSound);
        sound.play();
        addMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [user?.id, user?.role, addMessage]);

  const sendMessage = (payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("Sending message:", payload);
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.warn("WebSocket is not connected.");
    }
  };

  return { sendMessage };
};
