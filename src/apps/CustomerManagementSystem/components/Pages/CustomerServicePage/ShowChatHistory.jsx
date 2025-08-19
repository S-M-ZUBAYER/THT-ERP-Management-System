import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/UserContext';
import { ImFilePdf } from 'react-icons/im';
import { AiFillFileZip } from 'react-icons/ai';
import { FiFileText } from 'react-icons/fi';
import { FaFileCsv } from 'react-icons/fa';
import { BsFiletypeDocx } from 'react-icons/bs';
import { BsFiletypeXlsx } from 'react-icons/bs';
import ReactEmoji from 'react-emoji-render';
import Spinner from '../../Shared/Loading/Spinner';
import ImageModal from './ImageModal';


const ShowChatHistory = ({ userIdAllChat, customerUserId, SetUserIdAllChat }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  //collect data from useContext
  const { user, chattingUser, count } = useContext(AuthContext);


  //Open & close the modal to show the image in full display
  const openImageModal = (imgSrc) => {
    setSelectedImage(imgSrc);
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  }




  // Here make the functionalities to update and show the history according to the user 
  useEffect(() => {
    if (!userIdAllChat) return;
    if (count > 0) {
      console.log("merge");

      return
    }
    const mergedMessages = [];
    let currentMerging = null;
    console.log("general");
    for (let i = 0; i < userIdAllChat.length; i++) {
      const sms = userIdAllChat[i];

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

    SetUserIdAllChat(mergedMessages);
  }, []);

  console.log(userIdAllChat, customerUserId);
  console.log(chattingUser);
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const messageDateString = messageDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD
    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];

    if (messageDateString === todayString) {
      return 'Today';
    } else if (messageDateString === yesterdayString) {
      return 'Yesterday';
    } else {
      return timestamp; // Show actual date for older messages
    }
  };


  return (
    // Show the history from here for customer.. display all sms without the using customer service
    <div>
      {userIdAllChat && userIdAllChat?.length > 0 && userIdAllChat.map((chat, index) => {
        return <div key={index}>

          <div className="my-2 flex gap-0 w-full">

            {String(chat?.sentBy).trim() === String(customerUserId).trim() && (

              <>
                {/* show the image and onclick show full display */}
                <div className="w-6">
                  <img
                    className={`${chat?.sentTo === chattingUser?.userId ? "w-5 h-5 rounded-full border-2 border-green-400 animate-heartbeat" : "w - 6 h-6 rounded-full"}`}
                    src="https://cdn.pixabay.com/photo/2016/06/03/15/35/customer-service-1433639__340.png"
                    alt="User Avatar"
                  />
                </div>
                <div className="max-w-10/12 max-h-10/12 pt-3">
                  {chat?.msgType === "image"

                    ?

                    (<div>
                      <img
                        className="w-48 h-auto"
                        // src={`data:image/png;base64,${chat?.message}`}
                        src={chat?.message}
                        alt={`Image ${index}`}
                        onClick={() => openImageModal(chat?.message)}
                      />
                      <div className="flex justify-start pt-3">
                        <small className="text-right text-slate-500">
                          {chat?.timestamp} {chat?.server_timestamp ? formatTimestamp(chat.server_timestamp.split(" ")[0]) : ""}
                        </small>
                      </div>

                    </div>)

                    :

                    chat?.msgType === "video" ? (
                      <div>
                        {/* show the video and onclick show full display */}
                        <video
                          className="w-48 h-auto"
                          controls
                          // src={`data:video/mp4;base64,${chat?.message}`}
                          src={chat?.message}
                        />
                        <div className="flex justify-start pt-3">
                          <small className="text-right text-slate-500">
                            {chat?.timestamp} {chat?.server_timestamp ? formatTimestamp(chat.server_timestamp.split(" ")[0]) : ""}
                          </small>
                        </div>
                      </div>)

                      :

                      chat?.msgType === "file" ?
                        <div className="max-w-10/12 pt-3">
                          {/* show the file and onclick to download */}
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
                            const fileType = getFileType(chat?.message);

                            // Render the file based on its type
                            const getFileViewer = (fileType, message) => {
                              switch (fileType) {
                                case 'pdf':
                                  return (
                                    // Use a PDF viewer library or iframe to display the PDF
                                    <a href={message} target="_blank" rel="noopener noreferrer">
                                      <ImFilePdf className="text-red-500 font-bold text-7xl"></ImFilePdf>
                                    </a>
                                  );
                                case 'xlsx':
                                  return (
                                    // Use an Excel viewer library or iframe to display the Excel file
                                    // Be sure to choose a library that can handle XLSX files
                                    <a href={message} target="_blank" rel="noopener noreferrer">

                                      <BsFiletypeXlsx className="text-green-700 font-bold text-7xl"></BsFiletypeXlsx>
                                    </a>
                                  );
                                case 'docx':
                                  return (

                                    <a href={message} target="_blank" rel="noopener noreferrer">

                                      <BsFiletypeDocx className="text-blue-700 font-bold text-7xl"></BsFiletypeDocx>
                                    </a>
                                  );
                                case 'csv':
                                  return (
                                    // Render CSV content or use a CSV viewer if available
                                    <a href={message} target="_blank" rel="noopener noreferrer">
                                      <FaFileCsv className="text-green-700 font-bold text-7xl"></FaFileCsv>
                                    </a>
                                  );
                                case 'txt':
                                  return (
                                    // Render CSV content or use a CSV viewer if available
                                    <a href={message} target="_blank" rel="noopener noreferrer">
                                      <FiFileText className="text-black font-bold text-7xl"></FiFileText>
                                    </a>
                                  );
                                case 'zip':
                                  return (
                                    // Render a link to download the ZIP file
                                    // <a
                                    //   href={`data:application/zip;base64,${message}`}
                                    //   download={`${chat?.fileName}`}
                                    // >
                                    <a href={message} target="_blank" rel="noopener noreferrer">
                                      <AiFillFileZip className="text-yellow-700 font-bold text-7xl"></AiFillFileZip>
                                    </a>
                                  );
                                case 'rar':
                                  return (
                                    // Render a link to download the rar file
                                    <a href={message} target="_blank" rel="noopener noreferrer">
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
                          <div className="flex justify-start pt-3">
                            <small className="text-right text-slate-500">
                              {chat?.timestamp} {chat?.server_timestamp ? formatTimestamp(chat.server_timestamp.split(" ")[0]) : ""}
                            </small>
                          </div>
                        </div>

                        :
                        // Show the text message and icon in here 
                        (
                          <div className="bg-fuchsia-200 px-2 py-1  rounded-b-lg rounded-tr-lg text-black">
                            <p className="px-2 py-1 font-normal text-black"><ReactEmoji text={chat?.message} /></p>
                            <div className="flex justify-start">
                              <small className="text-right text-slate-500">
                                {chat?.timestamp} {chat?.server_timestamp ? formatTimestamp(chat.server_timestamp.split(" ")[0]) : ""}
                              </small>
                            </div>
                          </div>
                        )}
                </div>

              </>

            )}
          </div>


          <div className="my-2 flex justify-end w-full">

            {/* Show the history all sms for the customer service part from here  */}

            {String(chat?.sentBy).trim() !== String(customerUserId).trim() && (
              <>
                <div className="max-w-10/12 pt-3">
                  {chat?.msgType === "image"

                    ?

                    (<div>
                      {/* Here show the image and onclick to show full display this image */}
                      <img
                        className=" w-48 h-auto"
                        // src={`data:image/png;base64,${chat?.message}`}
                        src={chat?.message}
                        alt={`Image ${index}`}
                        onClick={() => openImageModal(chat?.message)}
                      />
                      <div className="flex justify-end mt-2">
                        <small className="text-end text-slate-500 text-xs mr-4">
                          {chat?.timestamp} {chat?.server_timestamp ? formatTimestamp(chat.server_timestamp.split(" ")[0]) : ""}
                        </small>

                        {
                          chat?.smsLoading &&
                          <Spinner></Spinner>
                        }
                      </div>

                    </div>)

                    :

                    chat?.msgType === "video" ? (
                      <div>
                        {/* Show the video in here and onclick to show the video on full display */}
                        <video
                          className="w-48 h-auto"
                          controls
                          // src={`data:video/mp4;base64,${chat?.message}`}
                          src={chat?.message}
                        />
                        <div className="flex justify-end mt-2">
                          <small className="text-end  text-slate-500 text-xs mr-1">{chat?.timestamp} {chat?.server_timestamp ? formatTimestamp(chat.server_timestamp.split(" ")[0]) : ""}</small>
                          {
                            chat?.smsLoading &&
                            <Spinner></Spinner>
                          }
                        </div>

                      </div>)

                      :

                      // Here show all the file and onclick to download
                      chat?.msgType === "file" ?
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
                            const fileType = getFileType(chat?.message);

                            // Render the file based on its type
                            const getFileViewer = (fileType, message) => {
                              switch (fileType) {
                                case 'pdf':
                                  return (
                                    // Use a PDF viewer library or iframe to display the PDF
                                    <a href={message} target="_blank" rel="noopener noreferrer">
                                      <ImFilePdf className="text-red-500 font-bold text-7xl"></ImFilePdf>
                                    </a>
                                  );
                                case 'xls':
                                  return (
                                    // Use an Excel viewer library or iframe to display the Excel file
                                    // Be sure to choose a library that can handle XLSX files
                                    <a href={message} target="_blank" rel="noopener noreferrer">

                                      <BsFiletypeXlsx className="text-green-700 font-bold text-7xl"></BsFiletypeXlsx>
                                    </a>
                                  );
                                case 'docx':
                                  return (
                                    // Use a document viewer library or iframe to display the document
                                    // You'll need a library that can handle DOCX files
                                    <a href={message} target="_blank" rel="noopener noreferrer">

                                      <BsFiletypeDocx className="text-blue-700 font-bold text-7xl"></BsFiletypeDocx>
                                    </a>
                                  );
                                case 'csv':
                                  return (
                                    // Render CSV content or use a CSV viewer if available
                                    <a href={message} target="_blank" rel="noopener noreferrer">
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
                                    <a href={message} target="_blank" rel="noopener noreferrer">
                                      <AiFillFileZip className="text-yellow-700 font-bold text-7xl"></AiFillFileZip>
                                    </a>
                                  );
                                case 'rar':
                                  return (
                                    // Render a link to download the rar file
                                    <a href={message} target="_blank" rel="noopener noreferrer">
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
                          <div className="flex justify-end mt-2">
                            <small className="text-end  text-slate-500 text-xs mr-1">{chat?.timestamp} {chat?.server_timestamp ? formatTimestamp(chat.server_timestamp.split(" ")[0]) : ""}</small>
                            {
                              chat?.smsLoading &&
                              <Spinner></Spinner>
                            }
                          </div>
                        </div>


                        :

                        // Show the text sms and icon in here
                        (<div className="bg-lime-200 px-2 py-1 rounded-b-lg rounded-tl-lg text-black">
                          <p className="px-2 py-1 font-normal text-black"><ReactEmoji text={chat?.message} /></p>
                          <div className="flex justify-end">
                            <small className="text-end  text-slate-500 text-xs mr-1">{chat?.timestamp} {chat?.server_timestamp ? formatTimestamp(chat.server_timestamp.split(" ")[0]) : ""}</small>
                            {
                              chat?.smsLoading &&
                              <Spinner></Spinner>
                            }
                          </div>
                        </div>
                        )}
                </div>

                <div className="w-6">
                  <img
                    className={`${chat?.sentBy === chattingUser?.userId ? "w-5 h-5 rounded-full border-2 border-yellow-400 animate-heartbeat" : "w - 6 h-6 rounded-full"}`}
                    src={user?.image ? user?.image : "https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"}
                    alt="User Avatar"
                  />
                </div>

                {/* Here add the new component to display the selected image  */}
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
      }
      )}
      <p className="my-5 font-bold text-yellow-500 text-center text-xl">--------------------------X---------------------------</p>
    </div>
  );
};

export default ShowChatHistory;