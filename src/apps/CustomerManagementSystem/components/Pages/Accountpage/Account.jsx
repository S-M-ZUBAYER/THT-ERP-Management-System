import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/UserContext";
import { toast } from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import BtnSpinner from "../../Shared/Loading/BtnSpinner";
import { Navigate } from "react-router-dom";
import ShowQuestionPagination from "./ShowQuestionPagination";
import ShowUnknownQuestionPagination from "./ShowUnknownQuestionPagination";
import {
  deleteAllChatsFromDB,
  manageDeleteChatsInDB,
} from "../CustomerServicePage/indexedDB";
const Account = () => {
  const QuestionPerPage = 25;

  //use useeContext to load data from  another components
  const {
    logOut,
    userInfo,
    SocketDisconnect,
    loading,
    setLoading,
    user,
    setUser,
    totalQuestions,
    translationQuestions,
    setTotalQuestions,
    setTranslationQuestions,
    translateCalculatePercentage,
    unknownCalculatePercentage,
    unknownPercent,
    setUnknownPercent,
    translationPercent,
    setTranslationPercent,
    unknownQuestions,
    setUnknownQuestions,
    setChattingUser,
  } = useContext(AuthContext);

  console.log(userInfo);

  //got the current user data from database  and get the data after getting the information about the current user
  useEffect(() => {
    if (user?.email) {
      fetchQuestionsByEmail();
      fetchUnknownQuestionsByEmail();
      translationsQuestionsByEmail();
    }
  }, [user?.email]);

  //fetch all searching question which questions are search by this specific users
  const fetchQuestionsByEmail = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:8033/tht/questions",
        {
          params: {
            email: user?.email,
          },
        }
      );
      setTotalQuestions(response.data);
      if (totalQuestions) {
        setUnknownPercent(
          unknownCalculatePercentage(totalQuestions, unknownQuestions)
        );
        setTranslationPercent(
          translateCalculatePercentage(totalQuestions, translationQuestions)
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //fetch all unknown question which questions are search by this specific users
  const fetchUnknownQuestionsByEmail = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:8033/tht/unknownQuestions",
        {
          params: {
            email: user?.email,
          },
        }
      );
      setUnknownQuestions(response.data);
      if (unknownQuestions) {
        setUnknownPercent(
          unknownCalculatePercentage(totalQuestions, unknownQuestions)
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //fetch all translation problem question which questions are search by this specific users
  const translationsQuestionsByEmail = async () => {
    try {
      const response = await axios.get(
        "https://grozziieget.zjweiting.com:8033/tht/translationsQuestions",
        {
          params: {
            email: user?.email,
          },
        }
      );
      setTranslationQuestions(response.data);
      if (translationQuestions) {
        setTranslationPercent(
          translateCalculatePercentage(totalQuestions, translationQuestions)
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const deleteCustomerServiceChatData = () => {
    console.log("call Delete function");
    // Iterate through all keys in localStorage
    Object.keys(localStorage).forEach((key) => {
      // Check if the key includes 'customerService@gmail.comLiveChat'
      if (key.includes("@gmail.comLiveChat")) {
        // Remove the item from localStorage
        localStorage.removeItem(key);
      }
    });
  };

  //create a function to LogOut user from this site
  // const handleToLogOut = async () => {

  //   try {
  //     console.log("call Logout");

  //     setLoading(true);
  //     SocketDisconnect();
  //     setUser(null);
  //     setChattingUser(null);
  //     localStorage.removeItem('chattingUser');
  //     await manageDeleteChatsInDB();
  //     await deleteAllChatsFromDB();
  //     localStorage.removeItem('user');
  //     deleteCustomerServiceChatData();
  //     toast.success("Logout successfully");
  //     setLoading(false);
  //   }
  //   catch (err) {
  //     toast.error(err)
  //   }

  // }

  const handleToLogOut = async () => {
    try {
      console.log("call Logout");

      setLoading(true);
      SocketDisconnect();
      setUser(null);
      setChattingUser(null);
      localStorage.removeItem("chattingUser");

      await manageDeleteChatsInDB(); // This might throw an error
      await deleteAllChatsFromDB(); // This might throw an error

      localStorage.removeItem("user");
      // deleteCustomerServiceChatData();
      toast.success("Logout successfully");
    } catch (err) {
      console.error("Logout error:", err); // Log the full error in the console
      // toast.error(err.message || "An unexpected error occurred"); // Ensure only a string is passed
    } finally {
      setLoading(false);
    }
  };

  // Here create the function to delete all question search by this specific user
  const handleToDeleteAllData = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete all questions?"
      );
      if (!confirmed) {
        return; // Cancel the deletion if the user clicks Cancel or closes the modal
      }

      await axios.delete(
        `https://grozziieget.zjweiting.com:8033/tht/questions/delete/${user?.email}`
      );
      toast.success("All questions deleted successfully");
      setTotalQuestions(
        totalQuestions.filter((question) => question?.email !== user?.email)
      );
      setUnknownPercent(
        unknownCalculatePercentage(totalQuestions, unknownQuestions)
      );
      setTranslationPercent(
        translateCalculatePercentage(totalQuestions, translationQuestions)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  //create a function to delete all unknown question from the frontend and database both side
  const handleToDeleteUnknownData = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete all unknown question?"
      );
      if (!confirmed) {
        return;
      }
      await axios.delete(
        `https://grozziieget.zjweiting.com:8033/tht/unknownQuestions/delete/${user?.email}`
      );
      toast.success("All unknown questions deleted successfully");
      setUnknownQuestions([]);
      setUnknownPercent(
        unknownCalculatePercentage(totalQuestions, unknownQuestions)
      );
      setTranslationPercent(
        translateCalculatePercentage(totalQuestions, translationQuestions)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  //create a function to delete one by one unknown question
  const handleToDeleteOneUnknownQuestions = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this unknown question?"
      );
      if (!confirmed) {
        return;
      }
      await axios.delete(
        `https://grozziieget.zjweiting.com:8033/tht/unknownQuestions/deleteById/${id}`
      );
      toast.success("A unknownQuestion deleted successfully");
      setUnknownQuestions(
        unknownQuestions.filter((question) => question?.id !== id)
      );
      setUnknownPercent(
        unknownCalculatePercentage(totalQuestions, unknownQuestions)
      );
      setTranslationPercent(
        translateCalculatePercentage(totalQuestions, translationQuestions)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  //create a function to delete all unknown question from the frontend and database both side
  const handleToDeleteTranslateData = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete all translations question?"
      );
      if (!confirmed) {
        return;
      }
      await axios.delete(
        `https://grozziieget.zjweiting.com:8033/tht/translateData/delete/${user?.email}`
      );
      toast.success("All translate questions deleted successfully");
      setTranslationQuestions([]);
      setUnknownPercent(
        unknownCalculatePercentage(totalQuestions, unknownQuestions)
      );
      setTranslationPercent(
        translateCalculatePercentage(totalQuestions, translationQuestions)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  //create a function to delete one by one unknown question from the frontend and database both side
  const handleToDeleteTranslationQuestions = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this translation question?"
      );
      if (!confirmed) {
        return;
      }
      await axios.delete(
        `https://grozziieget.zjweiting.com:8033/tht/translationQuestions/deleteById/${id}`
      );
      toast.success("A Translation deleted successfully");
      setTranslationQuestions(
        translationQuestions.filter((question) => question?.id !== id)
      );
      setUnknownPercent(
        unknownCalculatePercentage(totalQuestions, unknownQuestions)
      );
      setTranslationPercent(
        translateCalculatePercentage(totalQuestions, translationQuestions)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="mt-32 md:mx-36 text-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 text-center">
        {/* create this part to show th user pic */}
        <div className="flex justify-around">
          {userInfo?.image ? (
            <img className="rounded-full h-56 w-56" src={userInfo?.image}></img>
          ) : (
            <img
              className="rounded-full h-56 w-56"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAB+CAMAAADV/VW6AAAAZlBMVEUAAAD////u7u7t7e329vbv7+/+/v7x8fH6+vrIyMg6Ojo0NDTh4eGioqLa2tpra2vOzs4kJCSzs7N3d3eDg4Otra1QUFBZWVlISEi9vb2Xl5dgYGAuLi7n5+eMjIxAQEASEhIdHR13EZ5xAAAKwElEQVRogb1biZajKhAVQcDELWoWTUzS//+Tww4iaOxlas557atYXAVqpUwAJ5KmKUT8ikJ2mWGPmRomQpgWefm83g7Hx/F4PBxut+u97scyr/jvG+KWifmdabIPHjXn+vROwnS6jg1EKPsTeARI090iyIaOdTshf8yfwkOCUN6dtrAV1QPeCQ8ZKS6j1GMCPI1fH2JL6iuAjDgVY+IAEEwIJ4oZUXFprwQT8b/5dRe2oEvOILg4IYgPhGdjKiCc8CmAclOz6YBEPFnGmVTudDJsLniYbmwNwmMaJvDgU3trKm7FwyU09Ol4qTtJ9f1yeIS3xTWnZDamhU8/gi/uy0G/6jKfUrkpAJtNihBKq6GsA9ujnmj47TW82AEKnpG8NeWXFNDncryykEOp2bPi7DmKc/f2BUa2kdwxZ0AgQTGiYPCntB7Uy8ZE2LZqem8SHg2IS/iKZ5UE9fNhLmcY0JyF3hIEz952GQmJKl7M7BTzMa458e4UdgMGxDNK87nwvUBwn9Vr5vINIEH5EHyasYtm/gA5TletnisPM1DO3rzAbNIUPAzBe+Lizmr2ACUAAfE0oZykcRKX4mJ0BA+DtljLO9eYFLdHZ5ie4sCdQcVz9a2HSClJGrgThMSNjsHOGajOyFI8ZHacLX/KuY6v2A24bjSHt7OGiHxi9WpnyxE8H3QvPJgcs3mj2QY8mxNnwsqYH7I+A/ric3hE3H10kTKuy+EbILN+kDozny89ZuZ7zBDT89eDM5sUeA6X/4cpdZYxJ8Lewj7rqaGMy5iYhSvsiqnT7E7ui9klM87sHSXTvRPzO6V4Y413T82dkP/umR2r76eKWm0OREskf3aX4+NxvPZjnjHDsIjVjDioHmbYEcO41cvNbV9TPFhjsVjrxT/3VgKFQ0U0WTc0oCh8Yd8dxmNFCsskQCOJwkMC7fwXJAifUvIy6IVmLuAJbQ8hdGYezwt4I04Kg3+R2qPg7S61Kvdu6CwsRE4kSuowOKc6o8udL8VBY+a/x1abHL1vzTC5eAlPxUWIQ6vVgPur8fXeqrjVP7b8y1CTmJ/PYC5vbBnE5zVwTu0SXoljs2PeJv504M2kdhH5LKWb6PzZY+LIIuBFqGniiweNhIUpysOIc8pj4llmtl9F9ORLh42oCQ4q/n+SKcJHc4mL9yfw74IGxSm1ZuWimUrxkNl3T2zDwlkMQ9ArjOfTTUWFc3ExpnEorRdsaV2+oZDd4HfiPgK3oCcIiMvygIZ5IRfe7so8Bk+aCFiAmhi8nf4zcN9eP1UHQskwD/5pMNcL030pruJPqnf/Ack4n28NaxIm6m0YfUk/2vXm9XFo63EybqUVXKF4VIekPY3mY7tS/DsNKJ7UcG3ZH8bsEPNmWbaIlpTdmPags1kkAaslYjUzUK7hzYL0eBmsKfmgj41TiWLw5vVrBU9SxXhX2SJUVfJ0Z3nlGn17UOl7+LZMWOilLXktTDFzjpiHYSkPCwFitpIx4T50PvuuOFaxn3gmHXqfGZspnlEpvhrByhYlQwwmRkMwaedMs9MuRCTYWhduCESDtZ1Lz1OEaKiY6VJVQbjZ0UOPIA7fxWBi1MfhzbuUlMFjvaumFfjdhb1rHJ5o3bsjBq/d6E0WiIJrj3ZYXAMfrWpqNfoqYGJc7Yh5hqKsnt6lAHElIHg/PHLEpeKZMY2DG1i4oZe1oaEUVcaK34cPZajG8HcMXidAIArPmPvXHsXMDmNiddMRJHrpL+EE/bvw91V4ZXneRaKNwBiqjhiXFaitrlOHIh6PM43q5YnZBshWfJBXMEJ4WV3dIPY2VtwfE2sjWiZ64CqNl/4p+iDAn9M5HO0opl7xZ6Kc7Umng0GzQ6ooToSq1cMUpCL+OlEG+IXW4FP43gkPV+GxCq8uidK7Gqycu7AEfefeq8NlasNUmnRMVMbagUVY6MaKdG+0A8Khpq7VqyV/s3+CxmBZ0jJ3xnoFiYWagok7D/4cqQsa5ocZlqQXDSXItixIDbyiYQt+1+yzSHMd3k/YmlhZUjNJECdCMAsWRyy8b8YaEC1LquLMxxkmLx/ESkOKiUdPIg/UBVM3Q95jeaqluDemD6+rffETbLpS0pqTSCDWj5B9+HYTnnyse8U2vL+SJd1sHwAfur2RbrcP2BKi/NPTVO4QkZbIWjm/VMyUM8kxAjijY0zcYQLf7HRs58uoUidEqkrvMNFHuQ7TobC4CDUFM8XG6CrXd18xO1pxIfgg2+ij4q7eK5dzSlRZ5UE3rJ5gos2j/AteEdfwqV7GQ6I86Rf5BJ4Ujzgyp1e6Jm7gUz3nJthq1j0ekC4LNe819FO1Lq48XqpN2NOEmi2Nh5oOk67W11iItS6+CDV1oN0jrwIZPpklKG5839O2uGTaQFsHnQe8aXakPIGRnOOOlHcgm2ZHpxlTAvRmkieMUXhCkTphIcS32HIiqRRHVbppdJXIkSamjj84CbYfaqYIFeONnxUQ8XO1mIBLJauWkLbJa5zwWqhJ9fp1NDEHFD2Od3GgQU7XqCJIipuZ/7vm5ge5rHVLQbTJwyTYLU4y/SiPiOIh2lj/VGttJiBr+8PpnXwduvOkdYwQaxf7CizDVznDKl1/FyBJic7dGxIwOwC2s9z+VbmmFPOno0QfIeNmFpBeBiROhXyzoz33FTN4E3c90RIelgsvV+LIATpZ1r+O5UTJwubrnTvysxwTRR1d75LyiZqeoWaoa4MJXB6ggyakkKfnRJEeU8Ibx1HIA3Q9YwN1z8qp37hjqeadQPYAnfBBm6g37BFwO9bMkcINiaqmmYyrUTz+jEHl1vRqmYXjJlS8NyjOkYNVSU9IreJRnS6WSLYNmYJtYxpvcLnVmvg+9OVZUNkf3hs3f41M3aTZsRHzRNRhin6eTrUdoeqbLXpxujXKZuv0LrlzYyjgzSka5PBkfd6/S0++Q0hmpnogGh7ome7Z2qNpVzb5Ob2YdbK9ISdhisVZji3dTAjsrp1/TgPC5uXP4r3FEbKJvZInbiOiv0KtyS+OqYWHxv8//mTZLRk7VmIH/sMM4vfoOM0P0P90zpd0Rgoey4x7f8X+J3TR+b4+wd5zQvxzqhaNM3j3cc33qQOBvp3/B098eG57/tDezGkwMS102oT3FI9+Qr3TNuz0alL4R8Z+Tq+M2sTP7VbcXzb/DhXRZkn0H4xPG+/VhH+//E83Tle9mrbZ9/Pi3feo5s3CTurtd6iTPzW+F0jgaoc6SP9w+78IMkCRDnVCVmPmn9ABfdAgT+Cvh7mSeC/XAl6V/AjJZAUyy1CsfPEzukIwBxIOV5xri1ZNJA/QeS/wH+z/OiVeO0rgsyBlDRaHHT8m1Uzx4Xc5YPep6ToxW7fnsyCIql9UwFu1+6skBH8t/OkIiMKLryhUsXH2cQWLft+/Af7VAjumDxT6MkXX4H5lAno0q+v5X6YszI5za0abH7qAC69Eff9jyHhD+Cf0OstK6SY8hNGPIcn5mwnY4QxRsKrperxIb6a+5H++9QAHXteMjqmZkY8heWHNKgkF+U4z3DWyKOmMmcJ0/8eQhknKjx3R/QxpvFtxz8eQ7q2kOF83P4d91O1EUbZ+luPA2zjfKf9mgcMYnBGEimGlivZ+PQfxiVroLGftY8hIS3moTR2AqRnKsa+vt8OBfwIuPgLvnmPbMGi6Ie5vvX99FqUjieHjJAAAAABJRU5ErkJggg=="
            ></img>
          )}
        </div>

        {/* Here is the part to show all information about the current user */}
        <div className="text-start mt-20 md:mt-0 ">
          <div className="ml-20 md:ml-0 mx-auto md:mx-0">
            <div className="test-center">
              <h2 className="text-lg font-semibold mb-0 pb-0">
                {userInfo?.name}
              </h2>
              <p className="mb-4 ml-1">
                {userInfo ? userInfo?.designation : "Designation"}
              </p>
            </div>
            <div className="grid grid-cols-4 my-3">
              <p className="font-semibold">Contact Number:</p>
              <p>{userInfo?.phone}</p>
            </div>
            <div className="grid grid-cols-4 my-3">
              <p className="font-semibold">Email</p>
              <p>{user?.email}</p>
            </div>
            <div className="grid grid-cols-4 my-3">
              <p className="font-semibold">Country</p>
              <p>{userInfo ? userInfo?.country : "smzubayer9004@gmail.com"}</p>
            </div>
            <div className="grid grid-cols-4 my-3">
              <p className="font-semibold">Language</p>
              <p>{userInfo ? userInfo?.language : "Bengali"}</p>
            </div>
            <div className="my-20 mb-10">
              <button
                onClick={handleToLogOut}
                className="bg-[#004368]  px-20 rounded-md py-2 ml-2 text-white font-semibold hover:bg-slate-800"
              >
                {loading ? <BtnSpinner></BtnSpinner> : "Log out"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Show the all question, unknown question and translation problem question according to the specific user according to the pagination order */}
      <div className="mb-10 text-base">
        <ShowQuestionPagination
          handleToDeleteAllData={handleToDeleteAllData}
          totalQuestions={totalQuestions}
          QuestionPerPage={QuestionPerPage}
        ></ShowQuestionPagination>

        <ShowUnknownQuestionPagination
          handleToDeleteUnknownData={handleToDeleteUnknownData}
          unknownQuestions={unknownQuestions}
          handleToDeleteOneUnknownQuestions={handleToDeleteOneUnknownQuestions}
          unknownPercent={unknownPercent}
        ></ShowUnknownQuestionPagination>

        {/* create this part to show all of the store translation data which translation didn't get properly*/}

        <div className="flex justify-between text-3xl bg-red-200 py-1 font-bold mt-20 px-4">
          <h2 className="">Translation Questions</h2>
          <div className="flex items-center">
            <p>{translationPercent}% </p>
            <MdDeleteOutline
              onClick={handleToDeleteTranslateData}
              className="ml-5 text-2xl cursor-pointer"
            ></MdDeleteOutline>
          </div>
        </div>

        <div>
          <table className="w-full">
            <thead>
              <tr className="bg-orange-200">
                <th>No.</th>
                <th>Question</th>
                <th>English</th>
                <th>Bengali</th>
                <th>Time</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {translationQuestions?.length !== 0 ? (
                translationQuestions?.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td className="text-start">{item?.question}</td>
                    <td className="text-start">{item?.english}</td>
                    <td className="text-start">{item?.bangla}</td>
                    <td>{item?.time}</td>
                    <td>{item?.date}</td>
                    <td>
                      <button>
                        <MdDeleteOutline
                          onClick={() =>
                            handleToDeleteTranslationQuestions(item.id)
                          }
                          className="ml-5 text-2xl cursor-pointer"
                        ></MdDeleteOutline>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <span className="text-xl font-bold text-red-400">
                  NO Question Available
                </span>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Account;
