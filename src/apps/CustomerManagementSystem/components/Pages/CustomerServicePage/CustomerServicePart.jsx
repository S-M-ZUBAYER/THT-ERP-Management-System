import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/UserContext";
import { toast } from "react-hot-toast";
import { handleToCopy } from "./FunctionsForCustomerService/FunctionsForCustomerService";
import BtnSpinner from "../../Shared/Loading/BtnSpinner";
import DisplaySpinner from "../../Shared/Loading/DisplaySpinner";
import "../../../components/Shared/responsive-container.css";

const CustomerServicePart = () => {
  const {
    user,
    DUser,
    chattingUser,
    setDUser,
    loading,
    setLoading,
    totalQuestions,
    setTotalQuestions,
    setTotalQuestionLan,
    unknownQuestions,
    totalQuestionsLan,
    unknownQuestionsLan,
    setUnknownQuestions,
    setUnknownQuestionsLan,
    translationQuestions,
    setTranslationQuestions,
    setTranslationQuestionsLan,
    handleToStoreAllData,
    handleToDeleteAllData,
    setTranslationPercent,
    translationPercent,
    translateCalculatePercentage,
    unknownCalculatePercentage,
    setUnknownPercent,
    unknownPercent,
  } = useContext(AuthContext);

  //create this part to send data to the backend to got data
  const formData = new FormData();

  const [language, setLanguage] = useState("");
  const [name, setName] = useState("");
  const [engText, setEngText] = useState("");
  const [text, setText] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("");
  formData.append("message", text);
  const [chineseAnswer, setChineseAnswer] = useState([]);
  const [bengaliAnswer, setBengaliAnswer] = useState([]);
  const [englishAnswer, setEnglishAnswer] = useState([]);
  const [firstChineseAnswer, setFirstChineseAnswer] = useState([]);
  const [firstBengaliAnswer, setFirstBengaliAnswer] = useState([]);
  const [firstEnglishAnswer, setFirstEnglishAnswer] = useState([]);

  const [customerTranslation, setCustomerTranslation] = useState("");
  const inputField1 = document.getElementById("input1");
  const inputField2 = document.getElementById("input2");
  const inputField3 = document.getElementById("input3");
  const [filterAns, setFilterAns] = useState([]);

  const [sendLoading, setSendLoading] = useState(false);
  const [storeLoading, setStoreLoading] = useState(false);
  const [translateLoading, setTranslateLoading] = useState(false);
  const [RadioLoading, setRadioLoading] = useState(false);
  const [selectedShops, setSelectedShops] = useState(DUser?.selectedShops);
  const shopNames = DUser?.selectedShops;

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedShops((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedShops((prevSelected) =>
        prevSelected.filter((shop) => shop !== value)
      );
    }
  };

  useEffect(() => {
    // console.log(selectedShops, "after");
    // Call the function that depends on the updated selectedShops here if needed
    handleToShowShopAns();
  }, [selectedShops]);

  // create this function to send the data to the backend for translation and get the possible answers according to the customer questions.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSendLoading(true);
    setChineseAnswer([]);
    setEnglishAnswer([]);
    setBengaliAnswer([]);
    setFirstBengaliAnswer([]);
    setFirstEnglishAnswer([]);
    setFirstChineseAnswer([]);

    console.log(englishAnswer, firstEnglishAnswer);

    //create this part so that any one cannot send the data without input anythings
    if (!text) {
      toast.error("please input correct value");
      setLoading(false);
      setSendLoading(false);
      return;
    }

    // start the part for translations

    setText(e.target.inputField.value);
    setLanguage(localStorage.getItem("language"));
    setName(localStorage.getItem("name"));
    inputField2.value = "Typing...";
    inputField3.value = "Typing...";

    //This part for got the date and time according to the any event
    // create a new Date object
    const now = new Date();

    // extract the current date and time components
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    //create an object to send backend for English translations
    const engInput = {
      target: "English",
      text: text,
    };
    // let apiUrl = `https://zuss-chat-translator-server-site.vercel.app/translate`;
    let apiUrl = `https://grozziie.zjweiting.com:8035/tht/translate`;
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(engInput),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setEngText(data?.data);
        e.target.outputField2.value = data?.data;
      })
      .catch((error) => {
        console.error("Error:", error);
        inputField3.value = "Fail to translate please try again";
        // Handle the error, show a message to the user, etc.
      });

    // Create an object to send to the backend and start the process for Bengali translations
    const customerInput = {
      target: "Bengali",
      text: text,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(customerInput),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setCustomerTranslation(data?.data);
        inputField2.value = data?.data;
      })
      .catch((error) => {
        console.error("Error:", error);
        inputField2.value = "Fail to translate please try again";
        // Handle the error, show a message to the user, etc.
      });

    fetch("https://grozziie.zjweiting.com:8032/get_response", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the data returned by the Python backend

        setFirstChineseAnswer(
          data?.answers_CN.filter((product) =>
            shopNames
              ?.map((selected) => selected.split("/")[0])
              .some((shop) => product[3].includes(shop))
          )
        );
        setFirstEnglishAnswer(
          data?.answers_EN.filter((product) =>
            shopNames
              ?.map((selected) => selected.split("/")[0])
              .some((shop) => product[3].includes(shop))
          )
        );
        setFirstBengaliAnswer(
          data?.answers_BN.filter((product) =>
            shopNames
              ?.map((selected) => selected.split("/")[0])
              .some((shop) => product[3].includes(shop))
          )
        );

        if (selectedPrinter === "Attendance") {
          setChineseAnswer(
            data?.answers_CN
              .filter((product) =>
                shopNames
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
              .filter((product) => product[2].includes("Attendance"))
              .filter((product) =>
                selectedShops
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
          );
          setEnglishAnswer(
            data?.answers_EN
              .filter((product) =>
                shopNames
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
              .filter((product) => product[2].includes("Attendance"))
              .filter((product) =>
                selectedShops
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
          );
          setBengaliAnswer(
            data?.answers_BN
              .filter((product) =>
                shopNames
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
              .filter((product) => product[2].includes("Attendance"))
              .filter((product) =>
                selectedShops
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
          );
        } else if (selectedPrinter === "Thermal Printer") {
          setChineseAnswer(
            data?.answers_CN
              .filter((product) =>
                shopNames
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
              .filter((product) => product[2].includes("Thermal"))
              .filter((product) =>
                selectedShops
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
          );
          setEnglishAnswer(
            data?.answers_EN
              .filter((product) =>
                shopNames
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
              .filter((product) => product[2].includes("Thermal"))
              .filter((product) =>
                selectedShops
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
          );
          setBengaliAnswer(
            data?.answers_BN
              .filter((product) =>
                shopNames
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
              .filter((product) => product[2].includes("Thermal"))
              .filter((product) =>
                selectedShops
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
          );
        } else if (selectedPrinter === "Dot Printer") {
          setChineseAnswer(
            data?.answers_CN
              .filter((product) =>
                shopNames
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
              .filter((product) => product[2].includes("Dot"))
              .filter((product) =>
                selectedShops
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
          );
          setEnglishAnswer(
            data?.answers_EN
              .filter((product) =>
                shopNames
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
              .filter((product) => product[2].includes("Dot"))
              .filter((product) =>
                selectedShops
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
          );
          setBengaliAnswer(
            data?.answers_BN
              .filter((product) =>
                shopNames
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
              .filter((product) => product[2].includes("Dot"))
              .filter((product) =>
                selectedShops
                  .map((selected) => selected.split("/")[0])
                  .some((shop) => product[3].includes(shop))
              )
          );
        } else {
          setChineseAnswer(
            data?.answers_CN.filter((product) =>
              selectedShops
                .map((selected) => selected.split("/")[0])
                .some((shop) => product[3].includes(shop))
            )
          );
          setEnglishAnswer(
            data?.answers_EN.filter((product) =>
              shopNames
                .map((selected) => selected.split("/")[0])
                .some((shop) => product[3].includes(shop))
            )
          );
          setBengaliAnswer(
            data?.answers_BN.filter((product) =>
              shopNames
                .map((selected) => selected.split("/")[0])
                .some((shop) => product[3].includes(shop))
            )
          );
        }

        //store all the questions in Sql database
        if (user) {
          //load current user data from database
          fetch("https://grozziieget.zjweiting.com:8033/tht/questions/add", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              email: user?.email,
              question: text,
              date,
              time,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data) {
                toast.success("stored Successfully");
                setTotalQuestions([
                  ...totalQuestions,
                  { email: user?.email, question: text, date, time },
                ]);
                setUnknownPercent(
                  unknownCalculatePercentage(totalQuestions, unknownQuestions)
                );
                setTranslationPercent(
                  translateCalculatePercentage(
                    totalQuestions,
                    translationQuestions
                  )
                );
              } else {
                toast.error(data.message);
              }
            });
        }

        setSendLoading(false);
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("There was an error!", error);
        setLoading(false);
      });
  };

  // create a function for all check box filtering ans
  const handleToShowShopAns = async () => {
    setChineseAnswer([]);
    setBengaliAnswer([]);
    setEnglishAnswer([]);
    localStorage.setItem(
      "DUser",
      JSON.stringify({
        email: DUser?.email,
        password: DUser?.password,
        selectedShops,
      })
    );
    setSendLoading(true);

    setChineseAnswer(
      firstChineseAnswer.filter((product) =>
        selectedShops
          .map((selected) => selected.split("/")[0])
          .some((shop) => product[3].includes(shop))
      )
    );

    setEnglishAnswer(
      firstEnglishAnswer.filter((product) =>
        selectedShops
          .map((selected) => selected.split("/")[0])
          .some((shop) => product[3].includes(shop))
      )
    );

    setBengaliAnswer(
      firstBengaliAnswer.filter((product) =>
        selectedShops
          .map((selected) => selected.split("/")[0])
          .some((shop) => product[3].includes(shop))
      )
    );

    setSendLoading(false);
  };

  //create 3 function to divided the answer in 3 categories

  const handleToDotPrinterAns = () => {
    setSendLoading(true);

    setChineseAnswer(
      firstChineseAnswer
        .filter((product) => product[2].includes("Dot"))
        .filter((product) =>
          selectedShops
            .map((selected) => selected.split("/")[0])
            .some((shop) => product[3].includes(shop))
        )
    );
    setEnglishAnswer(
      firstEnglishAnswer
        .filter((product) => product[2].includes("Dot"))
        .filter((product) =>
          selectedShops
            .map((selected) => selected.split("/")[0])
            .some((shop) => product[3].includes(shop))
        )
    );
    setBengaliAnswer(
      firstBengaliAnswer
        .filter((product) => product[2].includes("Dot"))
        .filter((product) =>
          selectedShops
            .map((selected) => selected.split("/")[0])
            .some((shop) => product[3].includes(shop))
        )
    );

    setSendLoading(false);
  };

  const handleToThermalPrinterAns = () => {
    setSendLoading(true);

    setChineseAnswer(
      firstChineseAnswer
        .filter((product) => product[2].includes("Thermal"))
        .filter((product) =>
          selectedShops
            .map((selected) => selected.split("/")[0])
            .some((shop) => product[3].includes(shop))
        )
    );
    setEnglishAnswer(
      firstEnglishAnswer
        .filter((product) => product[2].includes("Thermal"))
        .filter((product) =>
          selectedShops
            .map((selected) => selected.split("/")[0])
            .some((shop) => product[3].includes(shop))
        )
    );
    setBengaliAnswer(
      firstBengaliAnswer
        .filter((product) => product[2].includes("Thermal"))
        .filter((product) =>
          selectedShops
            .map((selected) => selected.split("/")[0])
            .some((shop) => product[3].includes(shop))
        )
    );

    setSendLoading(false);
  };

  const handleToAttendanceMachineAns = () => {
    setSendLoading(true);

    setChineseAnswer(
      firstChineseAnswer
        .filter((product) => product[2].includes("Attendance"))
        .filter((product) =>
          selectedShops
            .map((selected) => selected.split("/")[0])
            .some((shop) => product[3].includes(shop))
        )
    );
    setEnglishAnswer(
      firstEnglishAnswer
        .filter((product) => product[2].includes("Attendance"))
        .filter((product) =>
          selectedShops
            .map((selected) => selected.split("/")[0])
            .some((shop) => product[3].includes(shop))
        )
    );
    setBengaliAnswer(
      firstBengaliAnswer
        .filter((product) => product[2].includes("Attendance"))
        .filter((product) =>
          selectedShops
            .map((selected) => selected.split("/")[0])
            .some((shop) => product[3].includes(shop))
        )
    );

    setSendLoading(false);
  };

  //create a function to store the unknown questions

  async function handleToUnknownStore() {
    //create this part so that any one cannot send the data without input anythings
    if (!text) {
      toast.error("please input correct value");
      return;
    }
    setStoreLoading(true);
    // create a new Date object
    const now = new Date();

    // extract the current date and time components
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    //store all the questions in Sql database
    if (user) {
      //create the functionalities to check so that same thing no need to store again
      let isDuplicate = false;

      unknownQuestions.forEach((question) => {
        if (question.question === text) {
          toast.error(
            "This question has already been stored as an unknown question"
          );
          isDuplicate = true;
        }
      });

      if (isDuplicate) {
        setStoreLoading(false);
        setText("");
        inputField2.value = "";
        inputField3.value = "";
        return;
      }

      //load current user data from database
      fetch("https://grozziieget.zjweiting.com:8033/tht/unknownQuestions/add", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          question: text,
          date,
          time,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.insertId) {
            toast.success("stored Successfully");
            setUnknownQuestions([
              ...unknownQuestions,
              { email: user?.email, question: text, date, time },
            ]);
            setUnknownPercent(
              unknownCalculatePercentage(totalQuestions, unknownQuestions)
            );
            setTranslationPercent(
              translateCalculatePercentage(totalQuestions, translationQuestions)
            );
          } else {
            toast.error(data.message);
          }
        });
      setStoreLoading(false);
    }

    try {
      const response = await fetch(
        "https://grozziie.zjweiting.com:8032/p_question_add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: text,
            time,
            date,
          }),
        }
      );
      const data = await response.json();
      if (data?.status === "success") {
        setText("");
        inputField2.value = "";
        inputField3.value = "";

        return;
      }

      if (data?.status === "error") {
        setText("");
        inputField2.value = "";
        inputField3.value = "";
        toast.error(data?.message);
        return;
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  }

  //create a function to store the translation sentences part

  async function handleToStoreTranslate() {
    if (!text) {
      toast.error("please input correct value");
      return;
    }
    setTranslateLoading(true);

    // create a new Date object
    const now = new Date();

    // extract the current date and time components
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    //store data in sql database

    if (user) {
      let isDuplicate = false;

      translationQuestions.forEach((question) => {
        if (question.question === text) {
          toast.error(
            "This question has already been stored as an translation question problem"
          );
          isDuplicate = true;
        }
      });

      if (isDuplicate) {
        setTranslateLoading(false);
        setText("");
        inputField2.value = "";
        inputField3.value = "";
        return;
      }

      //create the functionalities to check so that same thing no need to store again
      translationQuestions.map((question) => {
        if (question.question === text) {
          toast.error(
            "This question has already store as an translations problem question"
          );
          return;
        }
      });

      //load current user data from database
      fetch(
        "https://grozziieget.zjweiting.com:8033/tht/translationsQuestions/add",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: user?.email,
            question: text,
            english: engText,
            bangla: inputField2?.value,
            date,
            time,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            toast.success("translation questions stored Successfully");
            setTranslationQuestions([
              ...translationQuestions,
              {
                question: text,
                english: engText,
                bangla: inputField2?.value,
                date,
                time,
              },
            ]);
            setUnknownPercent(
              unknownCalculatePercentage(totalQuestions, unknownQuestions)
            );
            setTranslationPercent(
              translateCalculatePercentage(totalQuestions, translationQuestions)
            );
          } else {
            toast.error(data.message);
          }
        });
      setTranslateLoading(false);
    }

    const response = await fetch(
      "https://grozziie.zjweiting.com:8032/t_question_add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
          englishLan: engText,
          bengaliLan: inputField2.value,
          time,
          date,
        }),
      }
    );
    const data = await response.json();
    if (data?.status === "success") {
      //start the part to store data in localStorage

      // Retrieve the array from local storage
      // const storedArrayTranslationQuestions = localStorage.getItem('translationQuestions');
      // let storedArray = [];

      // // Check if the stored array exists
      // if (storedArrayTranslationQuestions) {
      //     storedArray = JSON.parse(storedArrayTranslationQuestions);
      // }

      // // Add a new element to the array
      // const newElement = { question: text, english: engText, bangla: inputField2?.value, date, time };
      // storedArray.push(newElement);

      // setTranslationQuestions(storedArray)

      // // Convert the modified array back to a string
      // const updatedArrayString = JSON.stringify(storedArray);

      // // Store the updated array in local storage
      // localStorage.setItem('translationQuestions', updatedArrayString);

      setText("");
      inputField2.value = "";
      inputField3.value = "";
      // toast.success("Question added successfully");

      return;
    }

    if (data?.status === "error") {
      setText("");
      inputField2.value = "";
      inputField3.value = "";
      toast.error(data?.message);
      return;
    }
  }

  // ***** select printer section ************************

  const handlePrinterChange = (e) => {
    setSelectedPrinter(e.target.value);
  };

  return (
    <div className="responsive-container">
      <div className=" my-6 flex justify-between bg-white">
        {/* create a from to send the question to the backend to translation and get all the possible ans */}
        <form onSubmit={handleSubmit} className="rounded w-2/3 pb-8 mb-4 ">
          <div className="mb-4">
            <label
              className="block font-semibold text-gray-700 mb-2 pl-2"
              htmlFor="input1"
            >
              Question from app
            </label>
            <textarea
              className="shadow overflow-y-scroll resize-none appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="input1"
              name="inputField"
              type="text"
              placeholder="Enter Question from app"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block  font-semibold text-gray-700 mb-2  pl-2"
              htmlFor="input2"
            >
              Customer Service Formate
            </label>
            <textarea
              className="shadow overflow-y-scroll resize-none appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="input2"
              type="text"
              name="outputField1"
              placeholder="Show in Customer Service"
            />
          </div>
          <div className="mb-4">
            <label
              className="block font-semibold text-gray-700 mb-2  pl-2"
              htmlFor="input3"
            >
              English Formate
            </label>
            <textarea
              className="shadow overflow-y-scroll resize-none appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="input3"
              type="text"
              placeholder="Show in English"
              name="outputField2"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-[#004368] hover:bg-blue-700   px-10 text-white font-bold py-1 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {sendLoading ? <BtnSpinner></BtnSpinner> : "Send"}
            </button>
          </div>
        </form>

        <div className=" ml-3">
          <p className="font-semibold my-3 text-slate-800 text-center">
            --Select ShopeNames--
          </p>

          <div
            className="text-start mb-8 "
            style={{
              minHeight: "290px",
              overflowY: "scroll",
              border: "1px solid #ccc",
            }}
          >
            {shopNames?.map((shop, index) => (
              <div className="pl-3" key={index}>
                <input
                  className="mr-2"
                  type="checkbox"
                  value={shop}
                  checked={selectedShops.includes(shop)}
                  onChange={handleCheckboxChange}
                  //  onClick={handleToShowShopAns}
                />
                {shop}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* create store button to call the function store the unknown questions to the database */}
      <div className="w-7/12 md:w-5/12 flex ml-auto">
        <div className="w-full flex justify-end">
          <button
            onClick={handleToUnknownStore}
            className=" bg-yellow-400 hover:bg-blue-200  px-1 md:px-10 text-black font-semibold md:font-bold py-1 rounded focus:outline-none focus:shadow-outline"
          >
            {storeLoading ? <BtnSpinner></BtnSpinner> : "Store"}
          </button>
        </div>

        {/* create store Translate button to call the function store miss translation part to the database */}
        <div className="w-full flex justify-end">
          <button
            onClick={handleToStoreTranslate}
            className=" bg-green-400 hover:bg-blue-200   px-1 md:px-10 text-black font-semibold md:font-bold py-1 rounded focus:outline-none focus:shadow-outline"
          >
            {translateLoading ? <BtnSpinner></BtnSpinner> : "Store Translate"}
          </button>
        </div>
      </div>

      {/* section to select the specific printer to get the proper ans for this particular printer */}

      <div className="flex justify-around w-8/12 text-gray-700">
        <div>
          <label>
            <input
              type="radio"
              className="bg-white"
              value="Dot Printer"
              checked={selectedPrinter === "Dot Printer"}
              onChange={handlePrinterChange}
              onClick={handleToDotPrinterAns}
            />
            Dot Printer
          </label>
        </div>

        <div>
          <label>
            <input
              type="radio"
              className="bg-white"
              value="Thermal Printer"
              checked={selectedPrinter === "Thermal Printer"}
              onChange={handlePrinterChange}
              onClick={handleToThermalPrinterAns}
            />
            Thermal Printer
          </label>
        </div>

        <div>
          <label>
            <input
              type="radio"
              className="bg-white"
              value="Attendance"
              checked={selectedPrinter === "Attendance"}
              onChange={handlePrinterChange}
              onClick={handleToAttendanceMachineAns}
            />
            Attendance
          </label>
        </div>
      </div>

      {/* create this part to show all the possible answers */}

      {sendLoading || RadioLoading ? (
        <DisplaySpinner></DisplaySpinner>
      ) : (
        <div className=" flex items-center justify-end">
          <div className="text-base font-semibold text-black " id="answerPart">
            {chineseAnswer?.length ? (
              chineseAnswer.map((element, index) => (
                <div
                  key={index}
                  className=" cursor-pointer common border-2 bg-lime-200 my-5 ml-10  p-3 rounded-tl-xl rounded-br-xl"
                >
                  <p
                    onClick={(e) => handleToCopy(e, element[1], index)}
                    id={`allAnswer${index}`}
                    className="allColor shadow-2xl common text-base rounded-md px-2 mb-2 py-2"
                  >
                    <span className="text-lg font-bold text-indigo-700">
                      Customer
                    </span>
                    :- {element[1]}
                  </p>

                  <p
                    onClick={(e) => handleToCopy(e, element[1], index)}
                    id={`allAnswer${index}`}
                    className="allColor common text-base  shadow-2xl rounded-md mb-2 p-2"
                  >
                    <span className="text-lg font-bold text-amber-800">
                      Customer Service
                    </span>
                    :- {bengaliAnswer[index][1]}
                  </p>
                  <p
                    onClick={(e) => handleToCopy(e, element[1], index)}
                    id={`allAnswer${index}`}
                    className="allColor common text-base  shadow-2xl  rounded-md p-2"
                  >
                    <span className="text-lg font-bold text-fuchsia-700">
                      Customer Service
                    </span>
                    :- {englishAnswer[index][1]}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-2xl mr-32 mt-20 font-bold text-amber-500">
                No Answer Available For This Question !!!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerServicePart;
