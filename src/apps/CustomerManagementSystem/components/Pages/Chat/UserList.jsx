import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/UserContext';

const UserList = ({ users, setSelectedCustomer, selectedCustomer, setMessages, messages, customerMessages }) => {

    const customerName = [
        {
            id: 11,
            name: "S M ZUBAYER",
            time: "3:22 pm",
            online: true
        },
        {
            id: 12,
            name: "S M SABIT",
            time: "3:54 pm",
            online: false
        },
        {
            id: 13,
            name: "ABU SAYED",
            time: "4:34 am",
            online: true
        },
        {
            id: 14,
            name: "ABU SAYED",
            time: "3:33 pm",
            online: true
        },
        {
            id: 15,
            name: "S M SABIT",
            time: "3:54 pm",
            online: false
        },
        {
            id: 16,
            name: "ABU SAYED",
            time: "3:33 am",
            online: false
        },
        {
            id: 17,
            name: "ABU SAYED",
            time: "7:83 pm",
            online: true
        },
        {
            id: 18,
            name: "S M SABIT",
            time: "4:53 am",
            online: false
        },
        {
            id: 19,
            name: "ABU SAYED",
            time: "3:40 pm",
            online: true
        }

    ]
    const [currentUser, setCurrentUser] = useState(null)
    const { user } = useContext(AuthContext)

    //got the current user data from database  
    useEffect(() => {
        if (user?.email) {
            fetchUserByEmail();
        }
    }, [user?.email]);


    const fetchUserByEmail = async () => {
        try {
            // const response = await axios.get('http://localhost:2000/tht/users', {
            const response = await axios.get('https://grozziieget.zjweiting.com:8033/tht/users', {
                params: {
                    email: user?.email,
                },
            });
            setCurrentUser(response.data[0]);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleToSelectedCustomer = (element) => {

        setSelectedCustomer(element);
        setMessages(customerMessages.filter(message => message?.id === selectedCustomer?.id))
    }

    return (
        <div>
            <div className=" h-[80vh] shadow-lg rounded-lg py-5 md:px-10">

                <div className="flex items-center justify-start">
                    <img className="h-8 w-8 ml-3 rounded-full  shadow-slate-900" src={currentUser ? currentUser?.image : user?.photoURL} alt="" />
                    <h1 className=" font-semibold ml-3">
                        {currentUser ? currentUser?.name : "User Name"}
                    </h1>
                </div>

                <div className="mt-6 mx-2 ">
                    <h2 className="bg-[#004368] text-gray-300 py-1 mx-1 rounded-md font-semibold">
                        Customer Name List
                    </h2>
                </div>

                <div className=" overflow-y-scroll h-[60vh]">
                    {
                        customerName.map((element, index) => {
                            return <div key={index} onClick={() => handleToSelectedCustomer(element)} className="text-sm  ml-2 px-3">
                                <div className="flex justify-between items-center mx-1 my-1">
                                    <div className="text-start">
                                        <p>{element?.name}</p>
                                        <p className="">This is message</p>
                                    </div>
                                    <div className="">
                                        {element.online ?
                                            <p className=" flex ml-auto bg-green-400 w-2 h-2 mb-1 rounded-full"></p>
                                            :
                                            // <p className=" flex ml-auto bg-slate-400 w-2 h-2 mb-1 rounded-full"></p> 
                                            ""

                                        }
                                        <p>{element?.time}</p>
                                    </div>

                                </div>
                                <hr></hr>
                            </div>
                        })
                    }


                </div>

            </div>


            <div className="user-list">
                <h2>User List</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            <span className={`status-dot ${user.online ? 'online' : 'offline'}`} />
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserList;
