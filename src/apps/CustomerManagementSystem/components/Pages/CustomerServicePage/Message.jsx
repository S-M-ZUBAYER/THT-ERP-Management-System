import React, { useContext, useEffect, useState } from 'react';
import UserContext, { AuthContext } from '../../../context/UserContext';
import { ImFilePdf } from 'react-icons/im';
import { AiFillFileZip } from 'react-icons/ai';
import { FiFileText } from 'react-icons/fi';
import { FaFileCsv } from 'react-icons/fa';
import { BsFiletypeDocx } from 'react-icons/bs';
import { BsFiletypeXlsx } from 'react-icons/bs';
import axios from 'axios';
import { HiChevronDoubleUp } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import BtnSpinner from '../Translator/BtnSpinner';
import Spinner from '../../Shared/Loading/Spinner';
import DisplaySpinner from '../../Shared/Loading/DisplaySpinner';
import ShowChatHistory from './ShowChatHistory';
import ImageModal from './ImageModal';
import ReactEmoji from 'react-emoji-render';
import { MdUnfoldMoreDouble } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { IoCheckmarkDoneSharp } from "react-icons/io5";


const Message = ({ selectedCustomerChat, showHistory, SetShowHistory, showModal, setShowModal, Loading }) => {
  const [userIdAllChat, SetUserIdAllChat] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  // collect data from useContext
  const { user, chattingUser, allChat, count, setCount, newAllChat, setNewAllChat } = useContext(AuthContext);
  const [selectedCount, setSelectedCount] = useState("5"); // Default selection


  const handleToShowHistory = () => {
    setShowModal(!showModal); // Open the modal first
  };

  const handleConfirmSelection = () => {
    setShowModal(!showModal); // Close modal
    SetShowHistory(!showHistory); // Toggle history after selection
  };


  // 2 function to display full image in modal
  const openImageModal = (imgSrc) => {
    setSelectedImage(imgSrc);
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  }

  //here make the functionalities to update the sms according to the current user and merge the multiple part to show the big size file
  useEffect(() => {

    if (!allChat) return;

    const mergedMessages = [];
    let currentMerging = null;

    for (let i = 0; i < allChat.length; i++) {
      const sms = allChat[i];

      if (sms?.initialShow === true) {
        mergedMessages.push(sms);
      } else if (sms.totalPart > 1) {
        if (sms.partNo === 1) {
          currentMerging = { ...sms, message: sms.message };
        } else if (sms.partNo === sms.totalPart && currentMerging && sms.sentId === currentMerging.sentId) {
          currentMerging.message += sms.message;
          currentMerging.totalPart = sms.totalPart;
          if (sms.partNo === sms.totalPart) {
            // If it's the last part, push the merged message
            mergedMessages.push(currentMerging);
            currentMerging = null;
          }
        } else if (sms.partNo > 1 && sms.partNo < sms.totalPart && currentMerging && sms.sentId === currentMerging.sentId) {
          currentMerging.message += sms.message;
          currentMerging.totalPart = sms.totalPart;
        }
      } else {
        mergedMessages.push(sms);
      }
    }

    setNewAllChat(mergedMessages);
  }, [allChat]);




  //get the update user to show the previous all sms of a customer 
  // useEffect(() => {
  //   if (showHistory) {
  //     console.log(selectedCount, "count");

  //     const fetchUserByUserId = async () => {
  //       setHistoryLoading(true);
  //       try {
  //         // const response = await axios.get(`https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/messages/userMessages/${selectedCustomerChat?.userId}/mergeFetch`);
  //         if (selectedCount===5){
  //           const response = await axios.get(`https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/messages/userMessages/${selectedCustomerChat?.userId}/SizeableMergeFetech/desc?page=0&size=5`);
  //         }
  //         elseIf(selectedCount ===10){
  //           const response = await axios.get(`https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/messages/userMessages/${selectedCustomerChat?.userId}/SizeableMergeFetech/desc?page=0&size=10`);
  //         }
  //         else{
  //     const response = await axios.get(`https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/messages/userMessages/${selectedCustomerChat?.userId}`);
  //         }
  //         if (response.status === 200) {
  //           // SetUserIdAllChat(response.data?.filter(data => data?.chatId !== selectedCustomerChat?.chatId));
  //           SetUserIdAllChat(response.data);
  //           setHistoryLoading(false);
  //           toast.success("Click to show the chat history");
  //         } else {
  //           console.error('Unexpected status code:', response.status);
  //           setHistoryLoading(false);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching user data:', error);
  //         setHistoryLoading(false);
  //       }
  //     };

  //     fetchUserByUserId();
  //   }
  // }, [selectedCustomerChat?.userId, showHistory]);
  useEffect(() => {
    if (showHistory) {
      const fetchUserByUserId = async () => {
        setHistoryLoading(true);
        try {
          let url = `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/messages/userMessages/${selectedCustomerChat?.userId}`;

          if (selectedCount === "5") {
            url += `/SizeableMergeFetech/desc?page=0&size=5`;
            setCount(count + 1);
          } else if (selectedCount === "10") {
            url += `/SizeableMergeFetech/desc?page=0&size=10`;
            setCount(count + 1);
          }

          const response = await axios.get(url);

          if (response.status === 200) {
            SetUserIdAllChat(response.data.reverse());
          } else {
            console.error("Unexpected status code:", response.status);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setHistoryLoading(false);
          setShowModal(false)
        }
      };

      fetchUserByUserId();
    }
  }, [selectedCustomerChat?.userId, showHistory, selectedCount]);


  const handleToShowMoreHistory = async () => {
    setHistoryLoading(true);
    try {
      let url = `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/messages/userMessages/${selectedCustomerChat?.userId}`;
      setCount(0);
      if (selectedCount === "5") {
        url += `/SizeableMergeFetech/desc?page=${count}&size=5`;
        setCount(count + 1);
      } else if (selectedCount === "10") {
        url += `/SizeableMergeFetech/desc?page=${count}&size=10`;
        setCount(count + 1);
      }

      const response = await axios.get(url);

      if (response.status === 200) {
        const lastSms = response.data.reverse();
        SetUserIdAllChat([...lastSms, ...userIdAllChat]);
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setHistoryLoading(false);
      setShowModal(false)
    }
  }



  return (
    <div className="mb-20">

      {/* Here make the component to show the history of a customer previous chat with another customer */}
      {
        count >= 1 && !historyLoading && <button className="w-full flex justify-center text-3xl text-blue-500" onClick={handleToShowMoreHistory}><MdUnfoldMoreDouble /></button>
      }
      {showHistory ? (historyLoading ? <BtnSpinner /> : userIdAllChat && userIdAllChat?.length > 0 ? (
        <ShowChatHistory userIdAllChat={userIdAllChat} customerUserId={selectedCustomerChat?.userId} SetUserIdAllChat={SetUserIdAllChat} />
      ) : (
        <div className="text-lg text-center font-semibold text-orange-400">No SMS available</div>
      )) : (
        ''
      )}


      {/* Here is the icon to show the history according to the clicking functionalities */}

      {selectedCustomerChat && (
        <div onClick={handleToShowHistory} className="flex justify-center cursor-pointer">
          <HiChevronDoubleUp className="text-green-400 font-bold text-3xl" />
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Select History Count</h2>

            <select
              value={selectedCount}
              onChange={(e) => setSelectedCount(e.target.value)}
              className="border rounded p-2 w-full bg-white"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="all">All</option>
            </select>

            <div className="flex justify-end mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded mr-2">
                Cancel
              </button>
              <button onClick={handleConfirmSelection} className="px-4 py-2 bg-green-500 text-white rounded">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Here start the part the current customer service showing sms  */}

      {Loading ? <DisplaySpinner /> : newAllChat && newAllChat.map((chat, index) => (
        <div key={index}>
          <div className="my-2 flex gap-0 w-full">
            {String(chat?.sentBy).trim() === String(selectedCustomerChat?.userId).trim() &&
              String(chat?.sentTo).trim() === String(selectedCustomerChat?.customerServiceId).trim() && (
                <>
                  <div className="w-6">

                    {/* Show the customer sending picture display in here in small or onclick full size */}
                    <img
                      className="w-5 h-5 rounded-full border-2 border-green-400 animate-heartbeat"
                      src="https://cdn.pixabay.com/photo/2016/06/03/15/35/customer-service-1433639__340.png"
                      alt="User Avatar"
                    />
                  </div>
                  <div className="max-w-10/12 pt-3">
                    {chat?.msgType === "image"

                      ?

                      (<div>
                        <img
                          className="w-48 h-auto"
                          src={`data:image/png;base64,${chat?.message}`}
                          alt={`Image ${index}`}
                          onClick={() => openImageModal(`data:image/png;base64,${chat?.message}`)}
                        />
                        <div className="flex justify-end pt-3">
                          <small className="text-end text-slate-500 text-xs mr-4">
                            {chat?.timestamp} {chat?.server_timestamp ? chat.server_timestamp.split(" ")[0] : ""}
                          </small>

                        </div>

                      </div>)

                      :

                      chat?.msgType === "video"

                        ?

                        (<div>

                          {/* Here show the video of customer sending video  */}
                          <video
                            className="max-w-full h-auto"
                            controls
                            src={`data:video/mp4;base64,${chat?.message}`}
                          />
                          <div className="flex justify-end pt-3">
                            <small className="text-end text-slate-500 text-xs mr-4">
                              {chat?.timestamp} {chat?.server_timestamp ? chat.server_timestamp.split(" ")[0] : ""}
                            </small>

                          </div>
                        </div>)

                        :


                        chat?.msgType === "file" ?

                          // Here show all kind of file like pdf, doc,xls and so on and also onclick to download the file
                          <div className="max-w-10/12 pt-3">
                            {(() => {
                              // Function to determine file type based on the message
                              const getFileType = (message) => {
                                if (message?.endsWith('.pdf')) {
                                  return 'pdf';
                                } else if (message?.endsWith('.xlsx')) {
                                  return 'xls';
                                } else if (message?.endsWith('.xls')) {
                                  return 'xlsx';
                                } else if (message?.endsWith('.txt')) {
                                  return 'txt';
                                } else if (message?.endsWith('.doc')) {
                                  return 'docx';
                                } else if (message?.endsWith('.docx')) {
                                  return 'docx';
                                } else if (message?.endsWith('.csv')) {
                                  return 'csv';
                                } else if (message?.endsWith('.zip')) {
                                  return 'zip';
                                } else if (message?.endsWith('.rar')) {
                                  return 'rar';
                                } else {
                                  return 'unknown'; // You can handle other formats as needed
                                }
                              };

                              // Determine the file type
                              const fileType = getFileType(chat?.fileName);

                              // Render the file based on its type
                              const getFileViewer = (fileType, message) => {
                                switch (fileType) {
                                  case 'pdf':
                                    return (
                                      // Use a PDF viewer library or iframe to display the PDF
                                      <a
                                        href={`data:application/zip;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >
                                        <ImFilePdf className="text-red-500 font-bold text-7xl"></ImFilePdf>
                                      </a>
                                    );
                                  case 'xlsx':
                                    return (
                                      // Use an Excel viewer library or iframe to display the Excel file
                                      // Be sure to choose a library that can handle XLSX files
                                      <a
                                        href={`data:application/zip;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >

                                        <BsFiletypeXlsx className="text-green-700 font-bold text-7xl"></BsFiletypeXlsx>
                                      </a>
                                    );
                                  case 'docx':
                                    return (

                                      <a
                                        href={`data:application/zip;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >

                                        <BsFiletypeDocx className="text-blue-700 font-bold text-7xl"></BsFiletypeDocx>
                                      </a>
                                    );
                                  case 'csv':
                                    return (
                                      // Render CSV content or use a CSV viewer if available
                                      <a
                                        href={`data:application/zip;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >
                                        <FaFileCsv className="text-green-700 font-bold text-7xl"></FaFileCsv>
                                      </a>
                                    );
                                  case 'txt':
                                    return (
                                      // Render CSV content or use a CSV viewer if available
                                      <a
                                        href={`data:application/txt;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >
                                        <FiFileText className="text-black font-bold text-7xl"></FiFileText>
                                      </a>
                                    );
                                  case 'zip':
                                    return (
                                      // Render a link to download the ZIP file
                                      <a
                                        href={`data:application/zip;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >
                                        <AiFillFileZip className="text-yellow-700 font-bold text-7xl"></AiFillFileZip>
                                      </a>
                                    );
                                  case 'rar':
                                    return (
                                      // Render a link to download the rar file
                                      <a
                                        href={`data:application/rar;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >
                                        <AiFillFileZip className="text-yellow-700 font-bold text-7xl"></AiFillFileZip>
                                      </a>
                                    );
                                  default:
                                    // Handle unknown or unsupported formats
                                    return <p>Unsupported File Format</p>;
                                }
                              };

                              // Usage in your component
                              const fileViewer = getFileViewer(fileType, chat?.message);
                              return <div>{fileViewer}</div>;

                            })()}
                            <div className="flex justify-end pt-3">
                              <small className="text-end text-slate-500 text-xs mr-4">
                                {chat?.timestamp} {chat?.server_timestamp ? chat.server_timestamp.split(" ")[0] : ""}
                              </small>

                            </div>
                          </div>


                          :


                          // Here show the customer text sms and icon
                          (<div className="bg-fuchsia-200 px-2 py-1  rounded-b-lg rounded-tr-lg text-black">
                            <p className="px-2 py-1 font-normal text-black"><ReactEmoji text={chat?.message} /></p>
                            <div className="flex justify-end"><small className=" text-right text-slate-500">{chat?.timestamp}</small> </div>

                          </div>
                          )}
                  </div>
                </>
              )}
          </div>


          {/* show the sms all part for customer service part */}
          <div className="my-2 flex justify-end w-full">
            {String(chat?.sentBy).trim() === String(selectedCustomerChat?.customerServiceId).trim() &&
              String(chat?.sentTo).trim() === String(selectedCustomerChat?.userId).trim() && (
                <>
                  {/* Show the customer service sending image in here and also onclick to display full in here  */}
                  <div className="max-w-10/12 pt-3">
                    {chat?.msgType === "image" ? (
                      <div>
                        <img
                          className=" w-48 h-auto"
                          src={`data:image/png;base64,${chat?.message}`}
                          alt={`Image ${index}`}
                          onClick={() => openImageModal(`data:image/png;base64,${chat?.message}`)}
                        />
                        <div className="flex justify-start mt-2">
                          <small className="text-end  text-slate-500 text-xs mr-4">{chat?.timestamp}</small>
                          {chat?.smsLoading ? (
                            chat?.smsServerStatus === "server" ? (
                              <p className="flex justify-end text-green-800">
                                <IoMdCheckmark />
                              </p>
                            ) : (
                              <Spinner />
                            )
                          ) : (
                            chat?.smsServerStatus === "server" && (
                              <p className="flex justify-end text-green-800">
                                <IoCheckmarkDoneSharp />
                              </p>
                            )
                          )}
                        </div>

                      </div>)

                      :

                      chat?.msgType === "video" ? (

                        //  in here show the customer service sending video in here
                        <div>
                          <video
                            className="max-w-full h-auto"
                            controls
                            src={`data:video/mp4;base64,${chat?.message}`}
                          />
                          <div className="flex justify-start mt-2">
                            <small className="text-end  text-slate-500 text-xs mr-4">{chat?.timestamp}</small>
                            {chat?.smsLoading ? (
                              chat?.smsServerStatus === "server" ? (
                                <p className="flex justify-end text-green-800">
                                  <IoMdCheckmark />
                                </p>
                              ) : (
                                <Spinner />
                              )
                            ) : (
                              chat?.smsServerStatus === "server" && (
                                <p className="flex justify-end text-green-800">
                                  <IoCheckmarkDoneSharp />
                                </p>
                              )
                            )}
                          </div>

                        </div>)

                        :

                        chat?.msgType === "file" ?

                          // In here show the all type of file like pdf, doc, xls and so on and also onclick download 
                          <div className="max-w-10/12 pt-3">
                            {(() => {
                              // Function to determine file type based on the message
                              const getFileType = (message) => {
                                if (message.endsWith('.pdf')) {
                                  return 'pdf';
                                } else if (message.endsWith('.xlsx')) {
                                  return 'xls';
                                } else if (message.endsWith('.xls')) {
                                  return 'xls';
                                } else if (message.endsWith('.txt')) {
                                  return 'txt';
                                } else if (message.endsWith('.doc')) {
                                  return 'docx';
                                } else if (message.endsWith('.docx')) {
                                  return 'docx';
                                } else if (message.endsWith('.csv')) {
                                  return 'csv';
                                } else if (message.endsWith('.zip')) {
                                  return 'zip';
                                } else if (message.endsWith('.rar')) {
                                  return 'rar';
                                } else {
                                  return 'unknown'; // You can handle other formats as needed
                                }
                              };

                              // Determine the file type
                              const fileType = getFileType(chat?.fileName);

                              // Render the file based on its type
                              const getFileViewer = (fileType, message) => {
                                switch (fileType) {
                                  case 'pdf':
                                    return (
                                      // Use a PDF viewer library or iframe to display the PDF
                                      <a
                                        href={`data:application/zip;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >

                                        <ImFilePdf className="text-red-500 font-bold text-7xl"></ImFilePdf>
                                      </a>
                                    );
                                  case 'xls':
                                    return (
                                      // Use an Excel viewer library or iframe to display the Excel file
                                      // Be sure to choose a library that can handle XLSX files
                                      <a
                                        href={`data:application/zip;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >

                                        <BsFiletypeXlsx className="text-green-700 font-bold text-7xl"></BsFiletypeXlsx>
                                      </a>
                                    );
                                  case 'docx':
                                    return (
                                      // Use a document viewer library or iframe to display the document
                                      // You'll need a library that can handle DOCX files
                                      <a
                                        href={`data:application/zip;base64,${message}`} b
                                        download={`${chat?.fileName}`}
                                      >

                                        <BsFiletypeDocx className="text-blue-700 font-bold text-7xl"></BsFiletypeDocx>
                                      </a>
                                    );
                                  case 'csv':
                                    return (
                                      // Render CSV content or use a CSV viewer if available
                                      <a
                                        href={`data:application/zip;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >
                                        <FaFileCsv className="text-green-700 font-bold text-7xl"></FaFileCsv>
                                      </a>
                                    );
                                  case 'txt':
                                    return (
                                      // Render CSV content or use a CSV viewer if available
                                      <a
                                        href={`data:application/txt;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >
                                        <FiFileText className="text-black font-bold text-7xl"></FiFileText>
                                      </a>
                                    );
                                  case 'zip':
                                    return (
                                      // Render a link to download the ZIP file
                                      <a
                                        href={`data:application/zip;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >
                                        <AiFillFileZip className="text-yellow-700 font-bold text-7xl"></AiFillFileZip>
                                      </a>
                                    );
                                  case 'rar':
                                    return (
                                      // Render a link to download the rar file
                                      <a
                                        href={`data:application/rar;base64,${message}`}
                                        download={`${chat?.fileName}`}
                                      >
                                        <AiFillFileZip className="text-yellow-700 font-bold text-7xl"></AiFillFileZip>
                                      </a>
                                    );
                                  default:
                                    // Handle unknown or unsupported formats
                                    return <p>Unsupported File Format</p>;
                                }
                              };

                              // Usage in your component
                              const fileViewer = getFileViewer(fileType, chat?.message);
                              return <div>{fileViewer}</div>;

                            })()}
                            <div className="flex justify-start mt-2">
                              <small className="text-end  text-slate-500 text-xs mr-4">{chat?.timestamp}</small>
                              {chat?.smsLoading ? (
                                chat?.smsServerStatus === "server" ? (
                                  <p className="flex justify-end text-green-800">
                                    <IoMdCheckmark />
                                  </p>
                                ) : (
                                  <Spinner />
                                )
                              ) : (
                                chat?.smsServerStatus === "server" && (
                                  <p className="flex justify-end text-green-800">
                                    <IoCheckmarkDoneSharp />
                                  </p>
                                )
                              )}
                            </div>
                          </div>


                          :

                          //show the customer service sending sms and icon show in here
                          (<div className="bg-lime-200 px-2 py-1 rounded-b-lg rounded-tl-lg text-black">
                            <div className="">
                              <p className=" col-span-9 px-2 py-1 font-normal text-black"><ReactEmoji text={chat?.message} /></p>

                            </div>


                            <div className="flex justify-between items-center">
                              <small className="text-slate-500 text-xs mr-4">{chat?.timestamp}</small>

                              {chat?.smsLoading ? (
                                chat?.smsServerStatus === "server" ? (
                                  <p className="flex justify-end text-green-800">
                                    <IoMdCheckmark />
                                  </p>
                                ) : (
                                  <Spinner />
                                )
                              ) : (
                                chat?.smsServerStatus === "server" && (
                                  <p className="flex justify-end text-green-800">
                                    <IoCheckmarkDoneSharp />
                                  </p>
                                )
                              )}
                            </div>

                          </div>
                          )}
                  </div>


                  <div className="w-6">
                    <img
                      className="w-5 h-5 rounded-full border-2 border-yellow-400 animate-heartbeat"
                      src={user?.image ? user?.image : "https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"}
                      alt="User Avatar"
                    />
                  </div>

                  {/* In here this component to display in full screen of selected image */}
                  {isModalOpen && (
                    <ImageModal
                      imgSrc={selectedImage}
                      alt="Guitar"
                      onClose={closeImageModal} // Close the modal when the "Close" button is clicked
                    />
                  )}
                </>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Message;
