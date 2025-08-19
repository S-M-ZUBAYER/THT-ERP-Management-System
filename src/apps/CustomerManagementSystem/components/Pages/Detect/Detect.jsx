import { useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import { FaCopy } from 'react-icons/fa';
import aiImg from "../../../Assets/Images/Detect/AI logo.png"
import animateImg from "../../../Assets/Images/Detect/animationPic.png"




const YOU = "you";
const AI = "ai";
function Detect() {
  const textareaRef = useRef();
  const [qna, setQna] = useState([]);
  const [loading, setLoading] = useState(false);


//create a function to make update array for question answer

  const updateQNA = (from, value) => {
    setQna((qna) => [...qna, { from, value }]);
  };


  //create a function for copy the text
  
  const handleToCopy=(e,v)=>{

    setTimeout(() => {
      e.target.classList.add("text-red-300")
      
    }, 20);
    
   
    e.target.classList.remove("text-red-300")
    let copyValue=v.split("：")[1]
navigator.clipboard.writeText(copyValue)
  }


  // This is the main function which send the question in openAIApi and get the ans from there

  const handleSend = () => {
    const question = textareaRef.current.value;
    textareaRef.current.value="";
    updateQNA(YOU, question);
// http://localhost:5000/   https://zuss-detect.vercel.app/detect
    setLoading(true);  
    axios
      .post("https://grozziieget.zjweiting.com:8033/tht/detect", {
      // .post("http://localhost:5000/tht/detect", {
        question,
      })
      .then((response) => {
        updateQNA(AI, response.data.answer);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };




// This function show the Question Answer in our user interface

  const renderContent = (qna) => {
    const value = qna.value;

    if (Array.isArray(value)) {
      return value.map((v) => <p className="message-text">
        {v} <FaCopy className="text-red-400 ml-2 inline-block hover:cursor-pointer" onClick={(e)=>handleToCopy(e,v)} 
        
        /></p>);
    }

    return <p className="message-text">{value}</p>;
  };


  return (
    <main className="mx-0 min-h-screen  relative">

{/* Header part the site heading name here */}

    <div className="text-center sticky top-16 w-full text-2xl py-3 font-bold text-sky-500 bg-gradient-to-t from-indigo-900 via-neutral-900 to-blue-900">
      ZUSS DETECT
      <p className="text-lg text-yellow-500">
        {/* Please ask me any question I will try to answer like ChatGPT: */}
        Please give me the information text to get proper address
      </p>
    </div>

{/* Questions & Answer showing section */}

      <div className="chats text-black text-left ml-5 mx-0 md:mx-10 mb-10">
        {qna.map((qna) => {
          if (qna.from === YOU) {
            return (
              <div className="send chat">
                <img
                  src={animateImg}
                  alt=""
                  className="avtar"
                />
                <p>{renderContent(qna)} </p>
              </div>
            );
          }
          return (
            <div className="recieve chat">
              <img
                src={aiImg}
                alt=""
                className="avtar"
              />
              <p>{renderContent(qna)} </p>
            </div>
          );
        })}

        {loading && (
          <div className="recieve chat">
            <img
              src={aiImg}
              alt=""
              className="avtar"
            />
            <p>Typing...</p>
          </div>
        )}
      </div>

      <div className="flex mx-1 md:mx-10 mt-10 mb-10 border-2">
        <textarea onKeyPress={handleKeyPress} 
        // type="text"
        ref={textareaRef}
        className="form-control pl-3 w-full bg-white"
        placeholder="Type Something"
        ></textarea>

        <button disabled={loading} className="border-2 text-black px-5 py-1 bg-lime-200 font-semibold bg-gradient-to-tr from-yellow-200 to-green-500 " onClick={handleSend}  onKeyDown={()=>handleKeyPress()} >
          Send
        </button>
      </div>
    </main>
  );
}

export default Detect;

