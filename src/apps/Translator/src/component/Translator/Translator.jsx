import { AiOutlineCopy, AiOutlineSound } from "react-icons/ai";
import { CiMicrophoneOn } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import countries from "./Countries";
import BtnSpinner from "./BtnSpinner";

import React from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageTextDetection from "./ImageTextDetection";
import TryImageDetect from "./TryImageDetect";
import { useLocation, useNavigate } from "react-router-dom";

function Translator() {
  const [isLoading, SetIsLoading] = useState(false);
  const [isLoading11, SetIsLoading11] = useState(false);
  const [isLoading2, SetIsLoading2] = useState(false);
  const [isLoading22, SetIsLoading22] = useState(false);
  const [targetLan, setTargetLan] = useState("");
  const [targetLan1, setTargetLan1] = useState("");
  const [text, setText] = useState("");
  const [text1, setText1] = useState("");
  // const [engText,setEngText]=useState('')
  const [midTranslate, setMidTranslate] = useState("");
  const [targetTranslate, setTargetTranslate] = useState("");
  const [targetTranslate1, setTargetTranslate1] = useState("");

  const textareaRef = useRef(null);
  const textareaRef1 = useRef(null);
  const divRef = useRef(null);
  const divRef11 = useRef(null);
  const divRef2 = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  console.log("private route");
  console.log(user);
  const navigate = useNavigate();

  const handleToLogOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const inputDiv = document.getElementById("inputField");
    inputDiv.value = text;
  }, [text]);

  // create the function to collect the target language to translate
  const handleTargetLan = (event) => {
    event.preventDefault();
    setTargetLan(event.target.value);
  };
  const handleTargetLan2 = (event) => {
    event.preventDefault();
    setTargetLan1(event.target.value);
  };
  // Create the function which show the toast if user didn't select the target language!
  const notify = () => {
    toast("Please select the target language!");
    return;
  };

  // create the function to collect the input text from the textarea to translate
  const handleToCollectText = (event) => {
    event.preventDefault();
    setText(event.target.value);
  };
  const handleToCollectText1 = (event) => {
    event.preventDefault();
    setText1(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleToTranslate();
    }
  };
  const handleKeyPress1 = (event) => {
    if (event.key === "Enter") {
      handleToSingleTranslate();
    }
  };

  const handleToCopy = (e) => {
    setTimeout(() => {
      // e.target.classList.add("text-red-200")
    }, 20);

    const range = document.createRange();
    range.selectNodeContents(divRef.current);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    // e.target.classList.remove("text-red-300")
  };

  const handleToCopy2 = (e) => {
    setTimeout(() => {
      // e.target.classList.add("text-red-200")
    }, 20);

    const range = document.createRange();
    range.selectNodeContents(divRef2.current);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    // e.target.classList.remove("text-red-300")
  };
  const handleToCopy22 = (e) => {
    setTimeout(() => {
      // e.target.classList.add("text-red-200")
    }, 20);

    const range = document.createRange();
    range.selectNodeContents(divRef11.current);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    // e.target.classList.remove("text-red-300")
  };

  const handleToCopyText = (e) => {
    setTimeout(() => {
      // e.target.classList.add("text-red-300")
    }, 20);

    textareaRef.current.select();
    document.execCommand("copy");
    // e.target.classList.remove("text-red-300")
  };

  const handleToTranslate = () => {
    const inputElement = document.getElementById("inputField");
    setMidTranslate("");
    setTargetTranslate("");
    SetIsLoading(true);
    SetIsLoading2(true);
    setText(text?.trim());

    if (!targetLan) {
      notify();
      return;
    }

    const targetInput = {
      target: targetLan,
      text,
    };

    // let apiUrl = `http://localhost:5000/tht/translate`;
    let apiUrl = `https://grozziie.zjweiting.com:8035/tht/translate`;

    // Step 1: Translate to Target Language First
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(targetInput),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const translatedText = data?.data?.replace(/^['"]|['"]$/g, "");
        setTargetTranslate(translatedText);
        SetIsLoading2(false);
        inputElement.value = "";

        // Step 2: Use the translated text for midTranslation
        const midInput = {
          target: "English",
          text: translatedText,
        };

        return fetch(apiUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(midInput),
        });
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setText(data?.data?.replace(/^['"]|['"]$/g, ""));
        setMidTranslate(data?.data?.replace(/^['"]|['"]$/g, ""));
        SetIsLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        SetIsLoading(false);
        SetIsLoading2(false);
        setMidTranslate("Failed to translate...");
        setTargetTranslate("Failed to translate...");
      });
  };

  const handleToSingleTranslate = () => {
    const inputElement1 = document.getElementById("inputField11");
    setTargetTranslate1("");
    SetIsLoading11(true);
    SetIsLoading22(true);
    setText1(text1?.trim());

    const targetInput1 = {
      target: targetLan1,
      text: text1,
    };

    // let apiUrl = `http://localhost:5000/tht/translate`;
    let apiUrl = `https://grozziie.zjweiting.com:8035/tht/translate`;

    if (!targetLan1) {
      notify();
    }

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(targetInput1),
    })
      .then((res) => {
        if (!res.ok) {
          // If the response status is not OK (2xx), throw an error
          throw new Error(`HTTP error! Status: ${res.status}`);
          SetIsLoading22(false);
          setTargetTranslate1("Failed to translate...");
        }
        return res.json(); // Return the JSON-parsed response for successful requests
      })
      .then((data) => {
        // Handle successful response
        const cleanedData = data?.data?.replace(/^['"]|['"]$/g, "");
        console.log(cleanedData);
        // setTargetTranslate1(data?.data);
        setTargetTranslate1(cleanedData);
        SetIsLoading22(false);
        inputElement1.value = "";
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Fetch error:", error);
        SetIsLoading22(false);
        setTargetTranslate1("Failed to translate...");
        // You can add code here to handle the error, such as showing a notification to the user
      });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-10 relative">
      {/* Single Language Translator */}
      <div>
        <h1 className="font-bold text-2xl text-center text-yellow-600 underline mb-8">
          Single language Translator System
        </h1>
        {user ? (
          <div className="flex justify-end">
            <div className=" flex items-center absolute top-10">
              <div className="mr-3">
                <img
                  className="w-8 h-8 rounded-full border-2 border-yellow-400 animate-heartbeat"
                  src={
                    user?.image
                      ? user?.image
                      : "https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
                  }
                  alt="User Avatar"
                />
              </div>
              <button
                className=" text-red-400  font-bold"
                onClick={handleToLogOut}
              >
                Log out
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate("/login")}>Log In</button>
        )}
      </div>

      <ToastContainer />
      <div className="flex justify-center mb-16">
        <div className=" ">
          {/* <h1 className="text-3xl font-bold mb-10 mt-10 md:mt-0">ZUSS Translator</h1> */}
          <div className=" bg-yellow-300 md:flex rounded-lg p-5">
            <div>
              <textarea
                id="inputField11"
                ref={textareaRef1}
                placeholder="please type here"
                onChange={handleToCollectText1}
                onDoubleClick={handleToSingleTranslate}
                onKeyPress={handleKeyPress1}
                className="border-2 bg-white text-black border-slate-600 rounded-t-lg md:rounded-t-none md:rounded-tl-lg p-2  mt-2 md:ml-2 h-44  w-72 md:w-64 lg:w-72  block"
              ></textarea>
              <div className="border-2 border-slate-600 md:ml-2 sm:rounded-b-lg md:rounded-b-none md:rounded-bl-lg mb-2 mr-2 md:mr-0">
                <div className="flex justify-between items-center ml-2">
                  <AiOutlineCopy
                    className="copyClass text-black cursor-pointer"
                    onClick={(e) => handleToCopyText(e)}
                  ></AiOutlineCopy>
                  <CiMicrophoneOn className="text-black"></CiMicrophoneOn>
                  <AiOutlineSound className="text-black"></AiOutlineSound>
                  <div>
                    <select
                      name="language"
                      type="boolean"
                      placeholder="Sold Status"
                      className="select select-bordered w-full px-2 py-2 bg-yellow-300 font-semibold rounded-lg  focus:outline-green-500  text-gray-900"
                    >
                      <option disabled selected>
                        {" "}
                        Detect language
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                ref={divRef11}
                placeholder="Translation"
                id="to-text"
                className="border-2 overflow-scroll text-start text-black bg-white border-slate-600 rounded-t-lg md:rounded-none md:rounded-tr-lg p-2 mt-2 mr-2 h-44  w-72 md:w-64 lg:w-72 block"
              >
                {isLoading22 ? <BtnSpinner></BtnSpinner> : targetTranslate1}
              </div>
              <div className="border-2 border-slate-600 md:rounded-br-lg mr-2  mb-2">
                <div className="flex justify-between items-center ml-2 ">
                  <AiOutlineCopy
                    className="copyClass text-black cursor-pointer"
                    onClick={(e) => handleToCopy22(e)}
                  ></AiOutlineCopy>
                  <CiMicrophoneOn className="text-black"></CiMicrophoneOn>
                  <AiOutlineSound className="text-black"></AiOutlineSound>

                  {/* To create the functionalities the select language */}

                  <div className="form-control" onChange={handleTargetLan2}>
                    <div className="input-group" id="lan">
                      <select
                        name="language"
                        type="boolean"
                        placeholder="Sold Status"
                        className="select select-bordered w-full px-3 py-2 rounded-md focus:outline-green-500 bg-yellow-300 font-semibold text-gray-900"
                      >
                        <option disabled selected>
                          {" "}
                          Select language
                        </option>
                        {countries?.map((element, index) => (
                          <option key={index}>{element}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create the button to generate the Translation */}

          {/* <div className="flex justify-around items-center ">
          <button className="my-5 bg-white w-full py-1 rounded-lg font-semibold" onClick={handleToTranslate} >Text Translate</button>
        </div> */}
        </div>
      </div>

      <h1 className="font-bold text-2xl underline text-lime-500">
        Multiple language Translator System
      </h1>
      <div className="App md:my-24 flex justify-center items-center">
        <ToastContainer />
        <div className=" ">
          {/* <h1 className="text-3xl font-bold mb-10 mt-10 md:mt-0">ZUSS Translator</h1> */}
          <div className=" bg-lime-300 md:flex rounded-lg p-5">
            <div>
              <textarea
                id="inputField"
                ref={textareaRef}
                placeholder="please type here"
                onChange={handleToCollectText}
                onDoubleClick={handleToTranslate}
                onKeyPress={handleKeyPress}
                className="border-2 bg-white text-black border-slate-600 rounded-t-lg md:rounded-t-none md:rounded-tl-lg p-2  mt-2 md:ml-2 h-44  w-72 md:w-64 lg:w-72  block"
              ></textarea>
              <div className="border-2 border-slate-600 md:ml-2 sm:rounded-b-lg md:rounded-b-none md:rounded-bl-lg mb-2 mr-2 md:mr-0">
                <div className="flex justify-between items-center ml-2">
                  <AiOutlineCopy
                    className="copyClass text-black cursor-pointer"
                    onClick={(e) => handleToCopyText(e)}
                  ></AiOutlineCopy>
                  <CiMicrophoneOn className="text-black"></CiMicrophoneOn>
                  <AiOutlineSound className="text-black"></AiOutlineSound>
                  <div className="py-2 mr-2">
                    {/* <select name='language' type="boolean" placeholder='Sold Status' className="select select-bordered w-full px-2 py-2 bg-lime-300 font-semibold rounded-lg  focus:outline-green-500  text-gray-900">
                                        <option disabled selected> Detect language</option>
                                    </select> */}

                    <ImageTextDetection
                      setText={setText}
                      text={text}
                      textId={"inputField"}
                      textareaRef={textareaRef}
                    ></ImageTextDetection>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                ref={divRef}
                placeholder="Translation"
                id="mid-text"
                className="border-2 text-start text-black rounded-t-lg overflow-scroll bg-white  md:rounded-t-none border-slate-600 p-2  mt-2 h-44 w-72 md:w-64 lg:w-72 block"
              >
                {isLoading ? <BtnSpinner></BtnSpinner> : midTranslate}
              </div>
              <div className="border-2 border-slate-600  mb-2 mr-2 md:mr-0 ">
                <div className="flex justify-between items-center ml-2 ">
                  <AiOutlineCopy
                    className="copyClass text-black cursor-pointer"
                    onClick={(e) => handleToCopy(e)}
                  ></AiOutlineCopy>
                  <CiMicrophoneOn className="text-black"></CiMicrophoneOn>
                  <AiOutlineSound className="text-black"></AiOutlineSound>
                  <div className="form-control">
                    <div className="input-group" id="lan">
                      <select
                        name="language"
                        type="boolean"
                        placeholder="Sold Status"
                        className="select select-bordered w-full bg-lime-300 font-semibold px-3 py-2 rounded-md  focus:outline-green-500  text-gray-900"
                      >
                        <option disabled selected>
                          English
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                ref={divRef2}
                placeholder="Translation"
                id="to-text"
                className="border-2 overflow-scroll text-start text-black bg-white border-slate-600 rounded-t-lg md:rounded-none md:rounded-tr-lg p-2 mt-2 mr-2 h-44  w-72 md:w-64 lg:w-72 block"
              >
                {isLoading2 ? <BtnSpinner></BtnSpinner> : targetTranslate}
              </div>
              <div className="border-2 border-slate-600 md:rounded-br-lg mr-2  mb-2">
                <div className="flex justify-between items-center ml-2 ">
                  <AiOutlineCopy
                    className="copyClass text-black cursor-pointer"
                    onClick={(e) => handleToCopy2(e)}
                  ></AiOutlineCopy>
                  <CiMicrophoneOn className="text-black"></CiMicrophoneOn>
                  <AiOutlineSound className="text-black"></AiOutlineSound>

                  {/* To create the functionalities the select language */}

                  <div className="form-control" onChange={handleTargetLan}>
                    <div className="input-group" id="lan">
                      <select
                        name="language"
                        type="boolean"
                        placeholder="Sold Status"
                        className="select select-bordered w-full px-3 py-2 rounded-md focus:outline-green-500 bg-lime-300 font-semibold text-gray-900"
                      >
                        <option disabled selected>
                          {" "}
                          Select language
                        </option>
                        {countries?.map((element, index) => (
                          <option key={index}>{element}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create the button to generate the Translation */}

          {/* <div className="flex justify-around items-center ">
          <button className="my-5 bg-white w-full py-1 rounded-lg font-semibold" onClick={handleToTranslate} >Text Translate</button>
        </div> */}
        </div>
      </div>
    </div>
  );
}

export default Translator;
