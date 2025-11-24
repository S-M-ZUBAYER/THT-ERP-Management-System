import React, { useContext, useEffect, useRef, useState } from 'react';

import CustomerServicePart from './CustomerServicePart';
import { AuthContext } from '../../../context/UserContext';
import axios from 'axios';
// import { Client } from '@stomp/stompjs';

import Message from './Message';
import MessageInput from './MessegeInput';
import toast from 'react-hot-toast';
import { SiSocketdotio } from 'react-icons/si';
import BtnSpinner from '../../Shared/Loading/BtnSpinner';
import { getMessagesFromDB, saveMessagesToDB } from './indexedDB';






const CustomerService_1 = () => {

    const { user, chattingUser, setCount, connected, setConnected, allChat, setAllChat, localStoreSms, setLocalStoreSms, customerStatus, setCustomerStatus, currentCustomer, setCurrentCustomer, fetchUserByUserId, selectedCustomerChat, setSelectedCustomerChat, newMessagesList, setNewMessagesList } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(null)

    // const [allChat, setAllChat] = useState([])
    const [showHistory, SetShowHistory] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const scrollableDivRef = useRef(null);
    const [Loading, setLoading] = useState(false);

    const [activeStatus, setActiveStatus] = useState("OFFLINE");




    //get all not view sms 
    useEffect(() => {
        const storedMessages = localStorage.getItem("newMessagesList");
        if (storedMessages) {
            try {
                const parsedMessages = JSON.parse(storedMessages);
                if (Array.isArray(parsedMessages)) {
                    setNewMessagesList(parsedMessages);
                }
            } catch (err) {
                console.error("Failed to parse messages from localStorage:", err);
            }
        }
    }, []);

    console.log(allChat, "all chatSD");


    // make the request to get the running time status 
    const fetchUserStatus = async (userId) => {
        try {
            const response = await fetch(`https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/status/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setActiveStatus(data);
                // Handle the data as needed
            } else {
                console.error('Failed to fetch user status');
            }
        } catch (error) {
            console.error('Error fetching user status:', error);
        }
    };




    // const disconnectAndClearCache = () => {
    //     if (connected) {
    //         // Disconnect from the WebSocket
    //         stompClient.deactivate();

    //         // Clear the cache or reset any relevant state
    //         // You can add code here to clear specific caches or reset state
    //         // For example, you can clear the chat history or reset the chatMessage state.

    //         // Clear the disconnect timer if it's set
    //         if (disconnectTimer) {
    //             toast.success("Disconnected successfully")
    //             clearTimeout(disconnectTimer);
    //         }
    //     }
    // };







    // <---------------------------Final Web Socket------------------------------------>









    const fetchUserByEmail = async () => {
        try {
            const response = await axios.get('https://grozziieget.zjweiting.com:8033/tht/users', {
                params: {
                    email: user?.email,
                },
            });
            // setCurrentUser(response.data[0]);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchUserByEmail();
        }
    }, [user?.email]);




    const fetchUserByChatId = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/messages/${selectedCustomerChat?.chatId}`);
            if (response.status === 200) {
                const userData = response.data;
                setAllChat(userData);
                setLoading(false);
            } else {
                // Handle unexpected status codes
                console.error('Unexpected status code:', response.status);
                setLoading(false);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };






    useEffect(() => {
        // fetchUserByChatId();
        fetchUserByUserId();
    }, [selectedCustomerChat?.chatId]);





    useEffect(() => {
        // Scroll to the bottom when component mounts or when content changes
        scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }, [allChat, selectedCustomerChat, newMessagesList]);






    const handleToSelectCustomer = async (customer) => {



        //call function to show the status
        fetchUserStatus(customer?.userId)

        if (customer?.status === "STOPPED") {
            setCustomerStatus("STOPPED");
        }
        if (customer?.status === "RUNNING") {
            setCustomerStatus("RUNNING");
        }

        // if (!liveChatArray ) {
        //     // If the key doesn't exist or customer?.userId doesn't exist, create a new array
        //     const newLiveChatArray = []

        //     localStorage.setItem(liveChatKey, JSON.stringify(newLiveChatArray));
        // } else {
        //     // Use the existing array
        //     setLocalStoreSms(liveChatArray.customer?.userId);
        // }



        const filteredMessages = newMessagesList?.filter(
            (list) => list.sentBy !== customer?.userId
        );
        const filteredInitialUserMessages = newMessagesList?.filter(
            (list) => list.sentBy === customer?.userId
        );
        // 👉 Update state
        setNewMessagesList(filteredMessages);

        // 👉 Also update localStorage
        localStorage.setItem("newMessagesList", JSON.stringify(filteredMessages));

        // setNewMessagesList((prevChat) => [...prevChat, {}]);
        SetShowHistory(false)
        setCurrentUser(customer);
        setCount(0);
        // connectWebSocket();
        // setSelectedCustomerChat((chatSms.filter(eachChat => eachChat.myId === customer?.id))[0])
        setSelectedCustomerChat(customer)
        const liveChatKey = `${user?.email}LiveChat${customer?.userId}`;
        // const liveChatArray = JSON.parse(localStorage.getItem(liveChatKey));
        const liveChatArray = await getMessagesFromDB(liveChatKey);
        if (Array.isArray(liveChatArray) && liveChatArray.length === 0) {
            console.log(filteredInitialUserMessages);
            setAllChat(filteredInitialUserMessages)
            await saveMessagesToDB(liveChatKey, filteredInitialUserMessages)
        }
        else {

            setAllChat(liveChatArray);
        }
    };



    return (
        <div>

            <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 md:gap-8 mx-3 md:mx-12 my-12 text-gray-600 bg-white" >



                {/* chatting list of all customers ************************************       */}



                <div className=" h-[80vh] shadow-lg rounded-lg py-5 md:px-10">

                    <div className="flex items-center justify-between">
                        <div className="flex justify-start">
                            <img className="h-8 w-8 ml-3 rounded-full  shadow-slate-900" src={user?.image ? user?.image : "https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"} alt="" />
                            <h1 className=" font-semibold ml-3">
                                {user?.name}
                            </h1>
                        </div>
                        <div className=" bg-red-900 rounded-full">
                            {connected ?
                                <SiSocketdotio className="bg-green-400 text-lg rounded-full"></SiSocketdotio> : <BtnSpinner></BtnSpinner>
                            }
                        </div>

                    </div>

                    <div className="mt-6 mx-2 ">
                        <h2 className="bg-[#004368] text-gray-300 py-1 mx-1 rounded-md font-semibold">
                            Customer Name List
                        </h2>
                    </div>

                    <div className=" overflow-y-scroll h-[60vh]">


                        {
                            currentCustomer.map((element, index) => {
                                return <div key={index} className={`text-sm  ml-2 px-3 cursor-pointer rounded-l-lg ${currentUser?.userId === element?.userId ? "bg-green-300" : ""}`}>
                                    <div onClick={() => handleToSelectCustomer(element)} className="flex justify-between items-center mx-1 my-1 cursor-pointer">
                                        <div className={`text-start font-semibold`}>
                                            <p >User Id: {element?.userId}</p>
                                            <p>Name:  {element?.userName ? element?.userName : `No Name(${element?.chatId})`}</p>


                                        </div>
                                        <div>
                                            {/* {(newMessagesList?.filter(sms => sms?.sentBy === element?.userId))?.length > 0 && <div className="bg-yellow-400 px-2 rounded-full border-2 text-black font-semibold"> {(newMessagesList?.filter(sms => sms?.sentBy === element?.userId))?.length}</div>} */}
                                            {(newMessagesList?.filter(sms => sms?.sentBy === element?.userId))?.length > 0 && <div className="bg-yellow-400 px-2 rounded-full border-2 text-black font-semibold"> {
                                                newMessagesList
                                                    ?.filter(
                                                        (sms, index, self) =>
                                                            sms?.sentBy === element?.userId &&
                                                            self.findIndex(msg => msg.message === sms.message) === index
                                                    )?.length
                                            }
                                            </div>}
                                        </div>
                                        <div className="">
                                            {element.status === "running" ?
                                                <p className=" flex ml-auto bg-green-400 w-2 h-2 mb-1 rounded-full"></p>
                                                :
                                                // <p className=" flex ml-auto bg-slate-400 w-2 h-2 mb-1 rounded-full"></p> 
                                                ""

                                            }
                                            <p>{(element?.timestamp).split(" ")[1].split(".")[0]}</p>
                                        </div>

                                    </div>
                                    <hr></hr>
                                </div>
                            })
                        }

                    </div>

                </div>


                {/* chatting customer field for customer and customer service ************************************       */}


                <div className=" h-[80vh] shadow-lg rounded-lg relative  mt-10 md:mt-0 md:px-10">


                    <div className="flex justify-around ">
                        {
                            activeStatus === "ONLINE" ? <p className="font-semibold text-green-600 px-2 py-0  border-4 rounded-full border-green-600">{currentUser?.userId}</p> : <p className="font-semibold text-red-600 px-2 py-0  border-4 rounded-full border-red-600">{currentUser?.userId}</p>
                        }

                        <p className="bg-[#004368] text-gray-200 px-2 rounded-b-lg py-1">Text from app</p>
                        <p className="font-semibold">{currentUser?.customerServiceName ? currentUser?.customerServiceName : `No Name(${currentUser?.userId})`}</p>
                    </div>

                    <div>
                        <h1 className="text-xl font-semibold text-gray-400 text-start pl-1 mt-2">
                            {currentUser?.name}
                        </h1>
                        <hr className="text-black font-bold my-1 mx-1"></hr>
                    </div>

                    <div className=" overflow-y-scroll h-[60vh] mb-10 text-start" ref={scrollableDivRef}>
                        <Message
                            allChat={allChat}
                            Loading={Loading}
                            setAllChat={setAllChat}
                            selectedCustomerChat={selectedCustomerChat}
                            showHistory={showHistory}
                            showModal={showModal}
                            setShowModal={setShowModal}
                            SetShowHistory={SetShowHistory}
                        ></Message>

                    </div>


                    <MessageInput
                        selectedCustomerChat={selectedCustomerChat}
                        setSelectedCustomerChat={setSelectedCustomerChat}
                        allChat={allChat}
                        setAllChat={setAllChat}
                        newMessagesList={newMessagesList}
                        setNewMessagesList={setNewMessagesList}
                    ></MessageInput>



                </div>


                {/* Manually chatting for online shopping application for customer service ************************************       */}

            </div>


            <div className="shadow-lg rounded-lg  mt-10 mb-20 md:mt-20 md:mx-10 px-3 md:px-10 md:py-10">

                <div className="flex justify-around ">
                    <p>Text from app</p>
                    <p className="bg-[#004368] text-gray-200 px-2 rounded-b-lg py-1">Customer Service</p>
                </div>

                <div>
                    <h1 className="text-xl  font-semibold text-gray-400 text-start pl-1 mt-2">
                        {currentUser?.name}
                    </h1>
                    <hr className="text-black font-bold my-1 mx-1"></hr>
                </div>


                <div className="mb-5 mx-1">
                    <CustomerServicePart></CustomerServicePart>
                </div>


            </div>

        </div>
    );
};

export default CustomerService_1;