import React, { createContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
// import app from "../Firebase/firebase.config";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import smsNotify from "../../../../CustomerManagementSystem/Assets/MP3/IphoneMobCup.mp3";
import notifyLogo from "../../../../CustomerManagementSystem/Assets/Images/Icons/webSiteLogo.jpg";
import app from "@/apps/CustomerManagementSystem/Firebase/firebase.config";
import { saveMessagesToDB } from "@/apps/CustomerManagementSystem/components/Pages/CustomerServicePage/indexedDB";
import { sendChatMessage } from "@/apps/CustomerManagementSystem/components/Pages/CustomerServicePage/SendMessageFunction";
export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chattingUser, setChattingUser] = useState(null);
  const [DUser, setDUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceCountry, setServiceCountry] = useState("EN");
  const [showData, setShowData] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [count, setCount] = useState(0);
  const [serverSmsCheck, setServerSmsCheck] = useState({});

  // <----------------------------chatting---------------------->

  const [connected, setConnected] = useState(false);
  const [newResponseCome, setNewResponseCome] = useState({});
  const [newAllMessage, setNewAllMessage] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newCome, setNewCome] = useState({});
  const [allChat, setAllChat] = useState([]);
  const [localStoreSms, setLocalStoreSms] = useState([]);
  const [customerStatus, setCustomerStatus] = useState("RUNNING");
  const [currentCustomer, setCurrentCustomer] = useState(() => {
    const stored = localStorage.getItem("CustomerChatList");
    return stored ? JSON.parse(stored) : [];
  });

  const [comingSMS, setComingSMS] = useState(null);
  const [selectedCustomerChat, setSelectedCustomerChat] = useState();
  const [newMessagesList, setNewMessagesList] = useState([]);
  const [fileSms, setFileSms] = useState({});
  const [newAllChat, setNewAllChat] = useState([]);

  // <----------------------------Others State ---------------------->
  const [unknownPercent, setUnknownPercent] = useState(0);
  const [translationPercent, setTranslationPercent] = useState(0);
  const [totalQuestionsLan, setTotalQuestionsLan] = useState(0);
  const [unknownQuestionsLan, setUnknownQuestionsLan] = useState(0);
  const [translationQuestionsLan, setTranslationQuestionsLan] = useState(0);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [translationQuestions, setTranslationQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState([]);
  const [unknownQuestions, setUnknownQuestions] = useState([]);

  console.log(currentCustomer, "frist");

  //get a user full information and search by email
  const fetchUserByEmail = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:8033/tht/users",
        {
          params: {
            email: user?.email,
          },
        },
      );
      setUserInfo(response.data[0]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const storedCustomers = localStorage.getItem("CustomerChatList");
    if (storedCustomers) {
      const parsedCustomers = JSON.parse(storedCustomers);
      if (Array.isArray(parsedCustomers) && parsedCustomers.length > 0) {
        setCurrentCustomer(parsedCustomers);
      }
    }
  }, []);

  //chatting list refresh process
  const fetchUserByUserId = async () => {
    const storedCustomers = localStorage.getItem("CustomerChatList") || "[]";
    if (storedCustomers) {
      const parsedCustomers = JSON.parse(storedCustomers);
      if (Array.isArray(parsedCustomers) && parsedCustomers.length > 0) {
        setCurrentCustomer(parsedCustomers);
        console.log("Loaded from localStorage");
        return;
      } else {
        // Fallback to API fetch
        try {
          if (!chattingUser?.userId) return;

          let response;
          if (serviceCountry === "EN") {
            response = await axios.get(
              `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/chatlist/customer_service/${chattingUser.userId}`,
            );
          } else {
            response = await axios.get(
              `https://jiapuv.com:3091/CustomerService-ChatCN/api/dev/chatlist/customer_service/${chattingUser.userId}`,
            );
          }

          if (response.status === 200) {
            const userData = response.data;
            const updateCustomerData = userData.sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
            );
            const uniqueData = getUniqueCustomers(updateCustomerData);
            setCurrentCustomer(uniqueData);
            localStorage.setItem(
              "CustomerChatList",
              JSON.stringify(uniqueData),
            );
          } else {
            console.error("Unexpected status code:", response.status);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    }
  };

  const fetchInitialUserByUserId = async () => {
    try {
      let response;
      if (serviceCountry === "EN") {
        response = await axios.get(
          `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/chatlist/customer_service/${chattingUser?.userId}`,
        );
      } else {
        response = await axios.get(
          `https://jiapuv.com:3091/CustomerService-ChatCN/api/dev/chatlist/customer_service/${chattingUser?.userId}`,
        );
      }
      if (response.status === 200) {
        // Request was successful

        const userData = response.data;
        const updateCustomerData = userData.sort((a, b) => {
          const timestampA = new Date(a.timestamp);
          const timestampB = new Date(b.timestamp);
          return timestampB - timestampA;
        });
        setCurrentCustomer(getUniqueCustomers(updateCustomerData));
        localStorage.setItem(
          "CustomerChatList",
          JSON.stringify(getUniqueCustomers(updateCustomerData)),
        );
      } else {
        // Handle unexpected status codes
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error fetching user data:", error);
    }
  };

  function getUniqueCustomers(currentCustomer) {
    const uniqueCustomers = currentCustomer.reduce((accumulator, customer) => {
      const userId = customer.userId;
      if (!accumulator.has(userId)) {
        accumulator.set(userId, customer);
      }
      return accumulator;
    }, new Map());

    return Array.from(uniqueCustomers.values());
  }

  useEffect(() => {
    if (serverSmsCheck?.partNo === serverSmsCheck?.totalPart) {
      if (serverSmsCheck?.sentId) {
        setAllChat((prevChats) =>
          prevChats.map((chat) =>
            chat.sentId === serverSmsCheck.sentId
              ? { ...chat, smsServerStatus: "server" }
              : chat,
          ),
        );
        setNewAllChat((prevChats) =>
          prevChats.map((chat) =>
            chat.sentId === serverSmsCheck.sentId
              ? { ...chat, smsServerStatus: "server" }
              : chat,
          ),
        );
      }
    }
  }, [serverSmsCheck]);

  useEffect(() => {
    if (user?.email) {
      fetchUserByEmail();
    }
  }, [user?.email]);

  // <----------------------------chatting start---------------------->
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  //here update the loading part depend of the response from the app (get sms or not)
  useEffect(() => {
    if (newResponseCome?.totalPart === newResponseCome?.partNo) {
      setAllChat((prevAllChat) => {
        return prevAllChat?.map((chat, index) => {
          if (
            chat?.sentId === newResponseCome?.sentId &&
            newResponseCome?.totalPart === newResponseCome?.partNo
          ) {
            return { ...chat, smsLoading: false };
          }
          // For other objects, return them as they are
          return chat;
        });
      });
    }
  }, [newResponseCome]);

  useEffect(() => {
    const updateAndStoreMessages = (messages) => {
      setNewMessagesList(messages);
      localStorage.setItem("newMessagesList", JSON.stringify(messages));
    };

    // Update status if matched
    let isMatched = false;
    const updatedCustomers = currentCustomer.map((customer) => {
      if (customer.userId === newCome.sentBy) {
        isMatched = true;
        return { ...customer, status: "RUNNING" };
      }
      return customer;
    });

    // If no match found, log it
    if (!isMatched) {
      fetchInitialUserByUserId();
    } else {
      isMatched = false;
      // Sort with matched one (if any) on top
      const sortedCustomers = updatedCustomers.sort((a, b) =>
        a.userId === newCome.sentBy ? -1 : b.userId === newCome.sentBy ? 1 : 0,
      );

      // Set state
      setCurrentCustomer(sortedCustomers);

      // Store in localStorage
      localStorage.setItem("CustomerChatList", JSON.stringify(sortedCustomers));
    }

    if (newCome.totalPart === 1) {
      console.log(currentCustomer, "customer");

      if (newCome && newMessagesList && newMessagesList.length > 0) {
        const updatedData = newMessagesList.filter(
          (data) => data.sentBy !== selectedCustomerChat?.userId,
        );
        if (newCome.sentBy !== selectedCustomerChat?.userId) {
          updateAndStoreMessages([...updatedData, newCome]);
        } else {
          updateAndStoreMessages(updatedData);
        }
      } else if (newCome && newCome.sentBy !== selectedCustomerChat?.userId) {
        updateAndStoreMessages([newCome]);
      }
    } else if (newCome.totalPart > 1 && newCome.partNo === 1) {
      if (newCome && newMessagesList && newMessagesList.length > 0) {
        const updatedData = newMessagesList.filter(
          (data) => data.sentBy !== selectedCustomerChat?.userId,
        );
        if (newCome.sentBy !== selectedCustomerChat?.userId) {
          updateAndStoreMessages([...updatedData, newCome]);
        } else {
          updateAndStoreMessages(updatedData);
        }
      } else if (newCome && newCome.sentBy !== selectedCustomerChat?.userId) {
        updateAndStoreMessages([newCome]);
      }
    }
  }, [newCome]);

  // <---------------------------Final Web Socket------------------------------------>
  // const stompClient = new Client({
  //   brokerURL: serviceCountry === "EN" ? 'wss://grozziieget.zjweiting.com:3091/CustomerService-Chat/websocket' : 'wss://jiapuv.com:3091/CustomerService-ChatCN/websocket',
  //   // brokerURL: 'ws://127.0.0.1:5000',
  //   //  brokerURL: 'ws://web-api-tht-env.eba-kcaa52ff.us-east-1.elasticbeanstalk.com/websocket',
  // });

  const brokerURL =
    serviceCountry === "EN"
      ? "wss://grozziieget.zjweiting.com:3091/CustomerService-Chat/websocket"
      : "wss://jiapuv.com:3091/CustomerService-ChatCN/websocket";

  const stompClient = new Client({ brokerURL });

  const SocketDisconnect = () => {
    if (connected) {
      console.log("disconnected");

      // Disconnect from the WebSocket
      stompClient.deactivate();
    }
  };

  const connect = () => {
    console.log("connect");

    stompClient.onConnect = (frame) => {
      setConnected(true);
      console.log("Connected: " + frame);

      fetchUserByUserId();

      // Function to send connectStatus
      const sendConnectStatus = () => {
        if (stompClient && stompClient.connected) {
          stompClient.publish({
            destination: "/app/connectStatus",
            body: JSON.stringify({
              userId: chattingUser?.userId,
              deviceId: navigator.appName + navigator.platform + user?.email,
            }),
          });
          console.log("Sent connectStatus update");
        } else {
          console.warn(
            "STOMP client is not connected. Skipping connectStatus update.",
          );
        }
      };

      // Send first connect status immediately
      sendConnectStatus();

      // Set interval to send every 20 seconds
      const intervalId = setInterval(sendConnectStatus, 20000);

      // Store intervalId so it can be cleared later if needed
      window.connectStatusInterval = intervalId;

      // Subscribe to messages
      stompClient.subscribe(`/topic/${chattingUser?.userId}`, (message) => {
        console.log(message?.body, "incoming message");
        const newSMS = JSON.parse(message.body);
        if (newSMS && newSMS.msgType === "ans") {
          setNewResponseCome(newSMS);
        }
        showGreeting(newSMS);
      });

      stompClient.subscribe(`/topic/chat`, (message) => {
        const parsedMessage = JSON.parse(message?.body);
        const newServerSms = parsedMessage?.body;
        if (newServerSms?.sentBy === chattingUser?.userId) {
          setServerSmsCheck(newServerSms);
        }
      });
    };

    stompClient.onWebSocketError = (error) => {
      console.error("Error with websocket", error);
    };

    stompClient.activate();
  };

  // Stop the interval when disconnecting or leaving the chat
  // stopSendingConnectStatus();

  useEffect(() => {
    let retryInterval;
    let reconnectInterval;

    // if (connected) {
    //   SocketDisconnect();
    // }

    // Initial connection attempt
    if (chattingUser) {
      connect();
    } else {
      return;
    }

    // Retry every 5 seconds if not connected
    retryInterval = setInterval(() => {
      if (!connected) {
        console.log("Reconnecting to WebSocket...");
        fetchUserByUserId();
        connect();
      } else {
        clearInterval(retryInterval); // Stop retrying if connected
      }
    }, 5000);

    // Force reconnection every 5 minutes only if chattingUser exists
    if (chattingUser) {
      reconnectInterval = setInterval(
        () => {
          console.log("Forcing reconnection every 5 minutes...");
          connect();
        },
        5 * 60 * 1000,
      ); // 5 minutes in milliseconds
    }

    // Cleanup on unmount
    return () => {
      clearInterval(retryInterval);
      if (reconnectInterval) clearInterval(reconnectInterval);
      stompClient.deactivate();
    };
  }, [connected, newAllMessage, chattingUser]); // Include chattingUser as a dependency

  //Here make the functionalities to change the interface after sending the sms , image, file, and video
  const getAnswer = async (sms) => {
    if (!sms) return;

    const liveChatKey = `${user?.email}LiveChat${selectedCustomerChat?.userId}`;

    // Check if it's a non-text message with only one part
    if (sms.totalPart === 1 && sms.partNo === 1 && sms.msgType !== "text") {
      if (fileSms && sms.sentId === fileSms.sentId) {
        await saveMessagesToDB(liveChatKey, [fileSms]);
        resetFileData();
      }
      return;
    }

    // Check if it's the last part of a multi-part non-text message
    if (
      sms.partNo > 0 &&
      sms.partNo === sms.totalPart &&
      sms.msgType !== "text"
    ) {
      if (fileSms && sms.sentId === fileSms.sentId) {
        await saveMessagesToDB(liveChatKey, [fileSms]);
        resetFileData();
      }
      return;
    }

    // Otherwise, process the message normally
    sendChatMessage(newAllMessage[sms.partNo]);
  };

  // Helper function to reset file-related state
  const resetFileData = () => {
    setSelectedFiles([]);
    setFileSms({});
  };

  // system notification

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    } else {
      console.log("This browser does not support notifications.");
    }
  };
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const showSystemNotification = (title, message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Message", {
        body: `${message} ${title}`,
        icon: notifyLogo, // Custom icon
        vibrate: [200, 100, 200], // Vibration pattern (on supported devices)
      });
    } else {
      console.log(
        "Notifications are not supported or permission is not granted.",
      );
    }
  };

  // Here make the functionalities to send the response and update the user interface after coming new sms
  const showGreeting = async (sms) => {
    if (sms.msgType === "ans") {
      getAnswer(sms);
      return;
    }

    //Add New response sms
    const textMessage = {
      chatId: sms?.chatId,
      sentBy: sms?.sentTo,
      sentTo: sms?.sentBy,
      sentId: sms?.sentId,
      message: sms?.msgType,
      msgType: "ans",
      totalPart: sms?.totalPart,
      partNo: sms?.partNo,
      timestamp: getCurrentTime(),
    };

    sendChatMessage(textMessage);
    if (sms && sms.msgType !== "ans") {
      setNewCome(sms);
    }
    setAllChat((prevChat) => [...(prevChat?.length ? prevChat : []), sms]);

    const handleFetchUser = () => {
      fetchUserByUserId();
    };
    const handleToastSuccess = () => {
      // Show system notification
      if (sms?.sentBy === 0) {
        return;
      } else if (sms?.msgType === "System") {
        return;
      } else {
        const audio = new Audio(smsNotify); // Ensure this path is correct
        audio
          .play()
          .then(() => {
            console.log("Audio played successfully");
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
          });
        toast.success(`${sms?.msgType} come from  Id:${sms?.sentBy}`, {
          position: "top-right",
        });
        showSystemNotification(
          `${sms?.msgType} from Id:${sms?.sentBy}`,
          "You have a new message!",
        );
      }
    };

    if (
      sms?.totalPart === 1 ||
      (sms?.totalPart > 1 && sms?.partNo === sms?.totalPart)
    ) {
      if (currentCustomer.length === 0) {
        handleFetchUser();
      }
      handleToastSuccess();
    }
    const liveChatKey = `${user?.email}LiveChat${sms?.sentBy}`;
    await saveMessagesToDB(liveChatKey, [sms]);
    // Here make the functionalities to store the coming sms in the local storage

    // const existingChat = JSON.parse(localStorage.getItem(liveChatKey)) || [];
    // const updatedChat = [...existingChat, sms];
    // localStorage.setItem(liveChatKey, JSON.stringify(updatedChat));
  };

  //Here make the nice formate to send the time
  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Determine AM or PM
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Add leading zeros to minutes if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  // Here delete the selected file from the interface
  const handleRemoveFile = (fileIndex) => {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== fileIndex,
    );
    setSelectedFiles(updatedFiles);
  };

  // Function to read a file as base64
  const readAsBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result.split(",")[1]); // Remove the "data:image/jpeg;base64," part
      };
    });
  };

  //Here make the function to split the base64 string into multiple part according to the size
  function splitBase64String(base64Data, maxSizeInBytes) {
    const base64Parts = [];
    let currentPart = "";
    for (let i = 0; i < base64Data.length; i++) {
      currentPart += base64Data.charAt(i);

      if (currentPart.length * 0.75 >= maxSizeInBytes) {
        // If the current part exceeds the specified size, push it to the array
        base64Parts.push(currentPart);
        currentPart = "";
      }
    }

    if (currentPart.length > 0) {
      // Push any remaining data as a part
      base64Parts.push(currentPart);
    }
    return base64Parts;
  }

  // <----------------------------chatting end---------------------->
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("DUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setDUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
      }
    }
    setLoading(false);
  }, []);

  // Calculation part for user based question answer showing
  function unknownCalculatePercentage(totalQuestions, currentQuestions) {
    let currentQuestionsLan;
    const totalQuestionsLan = totalQuestions.length;
    if (currentQuestions.length === 0 || totalQuestionsLan === 0) {
      return 0;
    }
    currentQuestionsLan = currentQuestions.length;
    const percentage = (currentQuestionsLan / totalQuestionsLan) * 100;
    return Math.round(percentage);
  }

  function translateCalculatePercentage(totalQuestions, currentQuestions) {
    let currentQuestionsLan;
    const totalQuestionsLan = totalQuestions.length;
    if (currentQuestions.length === 0 || totalQuestionsLan === 0) {
      return 0;
    }
    currentQuestionsLan = currentQuestions.length;
    const percentage = (currentQuestionsLan / totalQuestionsLan) * 100;
    return Math.round(percentage);
  }

  // User Create and login function part
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithFacebook = () => {
    return signInWithPopup(auth, facebookProvider);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const logOut = () => {
    return signOut(auth);
  };

  const authInfo = {
    user,
    DUser,
    setDUser,
    setUser,
    loading,
    setLoading,
    createUser,
    signIn,
    logOut,
    SocketDisconnect,
    signInWithGoogle,
    signInWithFacebook,
    resetPassword,
    translationQuestions,
    setTranslationQuestions,
    totalQuestions,
    setTotalQuestions,
    setTotalQuestionsLan,
    setUnknownQuestionsLan,
    translationQuestions,
    setTranslationQuestions,
    unknownQuestions,
    setUnknownQuestions,
    unknownCalculatePercentage,
    translateCalculatePercentage,
    unknownPercent,
    setUnknownPercent,
    translationPercent,
    setTranslationPercent,
    totalQuestionsLan,
    unknownQuestionsLan,
    translationQuestionsLan,
    setTranslationQuestionsLan,
    category,
    setCategory,
    categories,
    setCategories,
    chattingUser,
    setChattingUser,
    comingSMS,
    setComingSMS,
    connect,
    connected,
    setConnected,
    newResponseCome,
    setNewResponseCome,
    newAllMessage,
    setNewAllMessage,
    selectedFiles,
    setSelectedFiles,
    newCome,
    setNewCome,
    allChat,
    setAllChat,
    selectedCustomerChat,
    setSelectedCustomerChat,
    newMessagesList,
    setNewMessagesList,
    localStoreSms,
    setLocalStoreSms,
    customerStatus,
    setCustomerStatus,
    currentCustomer,
    setCurrentCustomer,
    fetchUserByUserId,
    serviceCountry,
    setServiceCountry,
    showData,
    setShowData,
    userInfo,
    fileSms,
    setFileSms,
    count,
    setCount,
    newAllChat,
    setNewAllChat,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default UserContext;
