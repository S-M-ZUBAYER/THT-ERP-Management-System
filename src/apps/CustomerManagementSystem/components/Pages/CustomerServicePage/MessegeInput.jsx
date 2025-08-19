import React, { useContext, useEffect, useState } from "react";
import { FaFileImage } from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
import { MdOndemandVideo } from "react-icons/md";
import { AiOutlineFileAdd } from "react-icons/ai";
import toast from "react-hot-toast";
import { Client } from "@stomp/stompjs";
import { AuthContext } from "../../../context/UserContext";
import { sendChatMessage } from "./SendMessageFunction";
import { saveMessagesToDB } from "./indexedDB";

const MessageInput = ({
  selectedCustomerChat,
  newMessagesList,
  setNewMessagesList,
}) => {
  const [message, setMessage] = useState("");
  const [fileType, setFileType] = useState(null); // Default to 'image'
  const [response, setResponse] = useState({});
  const [newSentId, setNewSentId] = useState(getCurrentTimestampInSeconds());

  //collect the value from useContext
  const {
    chattingUser,
    user,
    connected,
    setConnected,
    selectedFiles,
    setSelectedFiles,
    allChat,
    setAllChat,
    newCome,
    setNewCome,
    newAllMessage,
    setNewAllMessage,
    newResponseCome,
    setNewResponseCome,
    localStoreSms,
    setLocalStoreSms,
    customerStatus,
    setCustomerStatus,
    fetchUserByUserId,
    currentCustomer,
    fileSms,
    setFileSms,
  } = useContext(AuthContext);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  //According to the coming new sms here update the chatting sms and list and show the toast in here.
  useEffect(() => {
    if (newCome.totalPart === 1) {
      if (newCome && newMessagesList && newMessagesList.length > 0) {
        const updatedData = newMessagesList.filter(
          (data) => data.sentBy !== selectedCustomerChat?.userId
        );
        if (newCome.sentBy !== selectedCustomerChat?.userId) {
          setNewMessagesList([...updatedData, newCome]);
        } else {
          setNewMessagesList(updatedData);
        }
      } else if (newCome && newCome.sentBy !== selectedCustomerChat?.userId) {
        setNewMessagesList([newCome]);
      }
      // showList();
    } else if (newCome.totalPart > 1 && newCome.partNo === 1) {
      if (newCome && newMessagesList && newMessagesList.length > 0) {
        const updatedData = newMessagesList.filter(
          (data) => data.sentBy !== selectedCustomerChat?.userId
        );
        if (newCome.sentBy !== selectedCustomerChat?.userId) {
          setNewMessagesList([...updatedData, newCome]);
        } else {
          setNewMessagesList(updatedData);
        }
      } else if (newCome && newCome.sentBy !== selectedCustomerChat?.userId) {
        setNewMessagesList([newCome]);
      }
    }
  }, [newCome]);

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

  // Here make empty the new response status
  useEffect(() => {
    setNewCome({});
  }, [selectedCustomerChat]);

  //Make the function to send the time according to the sending time
  function getCurrentTimestampInSeconds() {
    const currentDate = new Date();
    const timestampInSeconds = Math.floor(currentDate.getTime() / 1000);
    return timestampInSeconds;
  }

  // <---------------------------Final Web Socket------------------------------------>
  const stompClient = new Client({
    brokerURL:
      "wss://grozziieget.zjweiting.com:3091/CustomerService-Chat/websocket",
    // brokerURL: 'ws://127.0.0.1:5000',
    //  brokerURL: 'ws://web-api-tht-env.eba-kcaa52ff.us-east-1.elasticbeanstalk.com/websocket',
  });

  const SocketDisconnect = () => {
    if (connected) {
      // Disconnect from the WebSocket
      stompClient.deactivate();
    }
  };

  const connect = () => {
    stompClient.onConnect = (frame) => {
      setConnected(true);
      console.log("Connected: " + frame);
      const response = new Promise((resolve) => {
        fetchUserByUserId();
        stompClient.publish(
          {
            destination: "/app/connectStatus",
            body: JSON.stringify({
              userId: chattingUser?.userId,
              deviceId: navigator.appName + navigator.platform + user?.email,
            }),
          },
          {},
          (response) => {
            resolve(response);
          }
        );
      });
      response.then((resolvedValue) => {
        // You can now use the resolved value here
        console.log("Promise resolved:", resolvedValue);
      });
      // stompClient.subscribe(`/topic/${chattingUser?.userId}`, (message) => {
      //   console.log(message?.body, "coming sms")
      //   const newSMS = JSON.parse(message.body);
      //   if (newSMS && newSMS.msgType === "ans") {
      //     setNewResponseCome(newSMS);
      //   }
      //   showGreeting(newSMS)

      // });
    };

    stompClient.onWebSocketError = (error) => {
      console.error("Error with websocket", error);
    };
    stompClient.activate();
  };

  useEffect(() => {
    let retryInterval;
    let reconnectInterval;

    // if (connected) {
    //   SocketDisconnect();
    // }

    // Initial connection attempt
    connect();

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
      reconnectInterval = setInterval(() => {
        console.log("Forcing reconnection every 5 minutes...");
        connect();
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
    }

    // Cleanup on unmount
    return () => {
      clearInterval(retryInterval);
      if (reconnectInterval) clearInterval(reconnectInterval);
      stompClient.deactivate();
    };
  }, [connected, newAllMessage, chattingUser]); // Include chattingUser as a dependency

  //Here make the functionalities to change the interface after sending the sms , image, file, and video
  const getAnswer = (sms) => {
    if (sms && sms.totalPart === 1) {
      setSelectedFiles([]);
    } else {
      if (sms && sms.partNo === sms.totalPart) {
        setSelectedFiles([]);
      } else {
        sendChatMessage(newAllMessage[sms.partNo]);
      }
    }
  };

  // Here make the functionalities to send the response and update the user interface after coming new sms
  const showGreeting = async (sms) => {
    if (sms.msgType === "ans") {
      getAnswer(sms);
      return;
    }

    //Add New response sms
    // const textMessage = {
    //   chatId: sms?.chatId,
    //   sentBy: sms?.sentTo,
    //   sentTo: sms?.sentBy,
    //   sentId: sms?.sentId,
    //   message: sms?.msgType,
    //   msgType: "ans",
    //   totalPart: sms?.totalPart,
    //   partNo: sms?.partNo,
    //   timestamp: getCurrentTime(),
    // };

    // sendChatMessage(textMessage);
    // if (sms && sms.msgType !== "ans") {
    //   setNewCome(sms);
    // }

    // setAllChat((prevChat) => [...(prevChat?.length ? prevChat : []), sms]);

    const handleFetchUser = () => {
      fetchUserByUserId();
    };

    // const handleToastSuccess = () => {
    //   const audio = new Audio(smsNotify); // Ensure this path is correct
    //   audio.play().then(() => {
    //     console.log('Audio played successfully');
    //   }).catch((error) => {
    //     console.error('Error playing audio:', error);
    //   });
    //   toast.success(`${sms?.msgType} come from  Id:${sms?.sentBy}`, {
    //     position: "top-right"
    //   });
    // };

    if (
      sms?.totalPart === 1 ||
      (sms?.totalPart > 1 && sms?.partNo === sms?.totalPart)
    ) {
      if (currentCustomer.length === 0) {
        handleFetchUser();
      }
      currentCustomer.forEach((element) => {
        if (element?.status !== "STOPPED" || element?.userId !== sms?.sentBy) {
          handleFetchUser();
          if (element?.userId === selectedCustomerChat?.userId) {
            setCustomerStatus("RUNNING");
          }
        }
      });

      // handleToastSuccess();
    }

    // Here make the functionalities to store the coming sms in the local storage

    // const liveChatKey = `${user?.email}LiveChat${sms?.sentBy}`;
    // const existingChat = JSON.parse(localStorage.getItem(liveChatKey)) || [];
    // const updatedChat = [...existingChat, sms];
    // localStorage.setItem(liveChatKey, JSON.stringify(updatedChat));
  };

  //To select or change the file to send
  const handleFileChange = async (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    const oversizedFile = fileArray.find((file) => file.size > maxSize);

    if (oversizedFile) {
      toast.error("More than 20MB cannot be sent");
      return;
    }
    setSelectedFiles(fileArray);

    // To convert the file in base64Data and make part by part according to the size
    const base64Data = await readAsBase64(fileArray[0]);
    const stringParts = splitBase64String(base64Data, 45000);

    //Make the structure and specific the part number to send one by one
    const newMessages = stringParts.map((part, index) => {
      if (fileType === "video" || fileType === "image") {
        return {
          chatId: selectedCustomerChat?.chatId,
          sentBy: selectedCustomerChat?.customerServiceId,
          sentTo: selectedCustomerChat?.userId,
          sentId: newSentId,
          message: fileType === "video" ? part : part,
          msgType: fileType === "video" ? "video" : "image",
          totalPart: stringParts.length,
          partNo: index + 1,
          timestamp: getCurrentTime(),
        };
      } else {
        return {
          chatId: selectedCustomerChat?.chatId,
          sentBy: selectedCustomerChat?.customerServiceId,
          sentTo: selectedCustomerChat?.userId,
          sentId: newSentId,
          message: fileType === "file" ? part : part,
          msgType: fileType === "file" ? "file" : "text",
          fileName: fileArray[0]?.name,
          totalPart: stringParts.length,
          partNo: index + 1,
          timestamp: getCurrentTime(),
        };
      }
    });

    // update the state to send the update sms
    setNewAllMessage(newMessages);
    setFileSms({
      ...newMessages[0], // Spread existing properties
      message: base64Data, // Modify message
      partNo: 1, // Modify partNo
      totalPart: 1,
    });
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
      (_, index) => index !== fileIndex
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

  //Here find the selected the file type
  const handleFileIconClick = (type) => {
    // Programmatically trigger the input file dialog when the icon is clicked
    document.getElementById("fileInput").click();
    setFileType(type);
  };

  //Make the function to work the submit for ENTER button
  const handleKeyDown = (e) => {
    // Check if the Enter key is pressed (key code 13)
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // function to send the sms part by part

  // latest
  const handleSubmit = async (e) => {
    if (customerStatus === "STOPPED") {
      toast.error(
        "You Can't Reply.May be customer connect with other Customer service"
      );
      return;
    }
    setNewSentId(getCurrentTimestampInSeconds());
    e.preventDefault();

    if (message.trim() !== "" || selectedFiles.length > 0) {
      const allMessages = [];

      //Make the formate only sending and waiting for response customer get sms or not
      if (message.trim() !== "") {
        const textMessage = {
          chatId: selectedCustomerChat?.chatId,
          sentBy: selectedCustomerChat?.customerServiceId,
          sentTo: selectedCustomerChat?.userId,
          sentId: newSentId,
          message: message,
          smsLoading: true,
          msgType: "text",
          totalPart: 1,
          partNo: 1,
          timestamp: getCurrentTime(),
        };
        allMessages.push(textMessage);

        // setAllChat([...allChat, {
        //   chatId: selectedCustomerChat?.chatId,
        //   sentBy: selectedCustomerChat?.customerServiceId,
        //   sentTo: selectedCustomerChat?.userId,
        //   sentId: newSentId,
        //   smsLoading: true,
        //   message: message,
        //   msgType: "text",
        //   totalPart: 1,
        //   partNo: 1,
        //   timestamp: getCurrentTime(),
        // }]);

        setAllChat((prevAllChat) => (prevAllChat ? [...prevAllChat] : []), {
          chatId: selectedCustomerChat?.chatId,
          sentBy: selectedCustomerChat?.customerServiceId,
          sentTo: selectedCustomerChat?.userId,
          sentId: newSentId,
          smsLoading: true,
          message: message,
          msgType: "text",
          totalPart: 1,
          partNo: 1,
          timestamp: getCurrentTime(),
        });

        // clear again the response sms
        setResponse({});

        //Send the formatting sms to the customer
        sendChatMessage({
          chatId: selectedCustomerChat?.chatId,
          sentBy: selectedCustomerChat?.customerServiceId,
          sentTo: selectedCustomerChat?.userId,
          sentId: newSentId,
          message: message,
          msgType: "text",
          totalPart: 1,
          partNo: 1,
          timestamp: getCurrentTime(),
        });

        // Get existing messages from local storage
        const liveChatKey = `${user?.email}LiveChat${selectedCustomerChat?.userId}`;
        const existingChat =
          JSON.parse(localStorage.getItem(liveChatKey)) || [];

        // Update local storage with the new SMS
        const updatedChat = [
          ...existingChat,
          {
            chatId: selectedCustomerChat?.chatId,
            sentBy: selectedCustomerChat?.customerServiceId,
            sentTo: selectedCustomerChat?.userId,
            sentId: newSentId,
            message: message,
            msgType: "text",
            totalPart: 1,
            partNo: 1,
            timestamp: getCurrentTime(),
          },
        ];
        const newText = {
          chatId: selectedCustomerChat?.chatId,
          sentBy: selectedCustomerChat?.customerServiceId,
          sentTo: selectedCustomerChat?.userId,
          sentId: newSentId,
          message: message,
          msgType: "text",
          totalPart: 1,
          partNo: 1,
          timestamp: getCurrentTime(),
        };
        // store the sending sms to the local storage
        // localStorage.setItem(liveChatKey, JSON.stringify(updatedChat));
        // store the sending sms to the indexDB storage
        await saveMessagesToDB(liveChatKey, [newText]);
      }

      // start the part to send the file to the customer
      if (selectedFiles.length > 0) {
        const file = selectedFiles[0]; // Use the first selected file
        const base64Data = await readAsBase64(file);
        const stringParts = splitBase64String(base64Data, 45000);

        if (fileType === "video" || fileType === "image") {
          setAllChat((prevChat) => [
            ...prevChat,
            {
              chatId: selectedCustomerChat?.chatId,
              sentBy: selectedCustomerChat?.customerServiceId,
              sentTo: selectedCustomerChat?.userId,
              sentId: newSentId,
              smsLoading: true,
              initialShow: true,
              message: fileType === "video" ? base64Data : base64Data,
              msgType: fileType === "video" ? "video" : "image",
              totalPart: stringParts.length,
              partNo: stringParts.length,
              timestamp: getCurrentTime(),
            },
          ]);
        } else {
          setAllChat((prevChat) => [
            ...prevChat,
            {
              chatId: selectedCustomerChat?.chatId,
              sentBy: selectedCustomerChat?.customerServiceId,
              sentTo: selectedCustomerChat?.userId,
              sentId: newSentId,
              smsLoading: true,
              initialShow: true,
              message: fileType === "file" ? base64Data : base64Data,
              msgType: fileType === "file" ? "file" : "text",
              fileName: file?.name,
              totalPart: stringParts.length,
              partNo: stringParts.length,
              timestamp: getCurrentTime(),
            },
          ]);
        }

        const newMessages = stringParts.map((part, index) => {
          if (fileType === "video" || fileType === "image") {
            return {
              chatId: selectedCustomerChat?.chatId,
              sentBy: selectedCustomerChat?.customerServiceId,
              sentTo: selectedCustomerChat?.userId,
              sentId: newSentId,
              message: fileType === "video" ? part : part,
              msgType: fileType === "video" ? "video" : "image",
              totalPart: stringParts.length,
              partNo: index + 1,
              timestamp: getCurrentTime(),
            };
          } else {
            return {
              chatId: selectedCustomerChat?.chatId,
              sentBy: selectedCustomerChat?.customerServiceId,
              sentTo: selectedCustomerChat?.userId,
              sentId: newSentId,
              message: fileType === "file" ? part : part,
              msgType: fileType === "file" ? "file" : "text",
              fileName: file?.name,
              totalPart: stringParts.length,
              partNo: index + 1,
              timestamp: getCurrentTime(),
            };
          }
        });

        // Send the first message in the newMessages array
        sendChatMessage(newMessages[0]);

        // Get existing messages from local storage
        const liveChatKey = `${user?.email}LiveChat${selectedCustomerChat?.userId}`;
        const existingChat =
          JSON.parse(localStorage.getItem(liveChatKey)) || [];

        // Update local storage with the new SMS
        const updatedChat = [
          ...existingChat,
          {
            ...newMessages[0], // Spread existing properties
            message: base64Data, // Modify message
            partNo: 1, // Modify partNo
            totalPart: 1,
          },
        ];
        const newText = {
          ...newMessages[0], // Spread existing properties
          message: base64Data, // Modify message
          partNo: 1, // Modify partNo
          totalPart: 1,
        };
        // await saveMessagesToDB(liveChatKey, [newText]);
        // localStorage.setItem(liveChatKey, JSON.stringify(updatedChat));

        // const updatedChat = [...existingChat, newMessages[0]];
        // localStorage.setItem(liveChatKey, JSON.stringify(updatedChat));
      } else {
        // Clear the 'text' variable if needed
        setMessage("");

        // setLocalStoreSms((prevChat) => [...prevChat, ...allMessages]);
        setAllChat([...allChat, ...allMessages]);
      }
    }
  };

  // const handleSubmit = async (e) => {
  //   if (customerStatus === "STOPPED") {
  //     toast.error("You Can't Reply. Maybe the customer is connected with another service.");
  //     return;
  //   }
  //   setNewSentId(getCurrentTimestampInSeconds());
  //   e.preventDefault();

  //   if (message.trim() !== '' || selectedFiles.length > 0) {
  //     const allMessages = [];

  //     const liveChatKey = `${user?.email}LiveChat${selectedCustomerChat?.userId}`;

  //     if (message.trim() !== '') {
  //       const textMessage = {
  //         chatId: selectedCustomerChat?.chatId,
  //         sentBy: selectedCustomerChat?.customerServiceId,
  //         sentTo: selectedCustomerChat?.userId,
  //         sentId: newSentId,
  //         message: message,
  //         msgType: "text",
  //         totalPart: 1,
  //         partNo: 1,
  //         timestamp: getCurrentTime(),
  //       };
  //       allMessages.push(textMessage);

  //       setAllChat((prevAllChat) => [...prevAllChat, textMessage]);
  //       setResponse({});
  //       sendChatMessage(textMessage);

  //       // Store messages in IndexedDB
  //       await saveMessagesToDB(liveChatKey, [textMessage]);
  //     }

  //     if (selectedFiles.length > 0) {
  //       const file = selectedFiles[0];
  //       const base64Data = await readAsBase64(file);
  //       const stringParts = splitBase64String(base64Data, 45000);

  //       const fileMessage = {
  //         chatId: selectedCustomerChat?.chatId,
  //         sentBy: selectedCustomerChat?.customerServiceId,
  //         sentTo: selectedCustomerChat?.userId,
  //         sentId: newSentId,
  //         smsLoading: true,
  //         initialShow: true,
  //         message: base64Data,
  //         msgType: fileType,
  //         fileName: file?.name,
  //         totalPart: stringParts.length,
  //         partNo: 1,
  //         timestamp: getCurrentTime(),
  //       };

  //       setAllChat((prevChat) => [...prevChat, fileMessage]);
  //       sendChatMessage(fileMessage);

  //       // Store in IndexedDB
  //       await saveMessagesToDB(liveChatKey, [fileMessage]);
  //     } else {
  //       setMessage('');
  //       setAllChat([...allChat, ...allMessages]);
  //     }
  //   }
  // };

  return (
    <div className=" absolute rounded-b-lg z-40 bg-white pt-1 w-full bottom-0 ">
      {/* Here are the design for the heading above the text area */}
      <div className="flex justify-around text-sm">
        <button className="bg-[#004368] text-white ml-8 hover:bg-blue-700 px-2 py-1 rounded-md mr-3">
          Auto Reply
        </button>
        <button className="">Select & Reply</button>
        <button className="mr-10">Typically</button>
      </div>

      {/* Here the form to send the text, image, video, doc,pdf etc */}
      <form onSubmit={handleSubmit} className={`p-4 `}>
        <div
          className={`flex gap-2  w-full items-center px-3 my-2 bg-white z-40`}
        >
          <button
            onClick={() => handleFileIconClick("image")}
            className={` ${fileType === "image" ? "selected" : ""}`}
            title="Click to select an image file"
          >
            <FaFileImage className="mr-2 text-gray-400 cursor-pointer" />
          </button>
          <button
            onClick={() => handleFileIconClick("video")}
            className={` ${fileType === "video" ? "selected" : "image"}`}
            title="Click to select a video file"
          >
            <MdOndemandVideo className="mr-2 text-gray-400 text-xl cursor-pointer"></MdOndemandVideo>
          </button>

          <input
            id="fileInput"
            type="file"
            accept={fileType === "image" ? "image/*" : "video/*"}
            onChange={handleFileChange}
            className="hidden"
          />

          <div>
            <button
              onClick={() => handleFileIconClick("file")}
              className={` ${fileType === "file"}`}
              title="Click to select a pdf, doc or other file "
            >
              <AiOutlineFileAdd className="mr-2 text-gray-400 text-xl cursor-pointer"></AiOutlineFileAdd>
            </button>
            <input
              id="fileInput"
              type="file"
              accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .ppt, .pptx, .csv, .zip, .rar"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={`relative w-9/12 md:w-8/12 lg:9/12 py-1 px-2 rounded-md bg-cyan-200  ${
              customerStatus === "STOPPED" && "bg-red-500"
            }`}
          />
          <button
            className="flex items-center absolute right-[55px] lg:right-[95px] "
            type="submit"
          >
            <AiOutlineSend className=" cursor-pointer"></AiOutlineSend>
          </button>
        </div>
        {/* Make the design to show and delete the selected file */}
        <div className="mt-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-300 p-2 w-10/12"
            >
              <span className="mr-2">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="text-red-600 font-bold cursor-pointer"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
