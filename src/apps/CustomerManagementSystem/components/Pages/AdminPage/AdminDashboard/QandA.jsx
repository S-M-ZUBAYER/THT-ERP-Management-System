import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/UserContext";
import { toast } from "react-hot-toast";
import QuestionAnswerTable from "./QandAComponents.js/QuestionsAnswersTable";
import SupportLinkManagement from "./SupportLinkManagement";

function QandA() {
  const [questionAnswer, setQuestionsAnswer] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [about, setAbout] = useState("");
  const [helpCenter, setHelpCenter] = useState("");
  const [businessCooperation, setBusinessCooperatin] = useState("");
  const { user } = useContext(AuthContext);
  const now = new Date();

  //got the current user data from database  
  useEffect(() => {
    if (user?.email) {

      fetchQuestionsAnswerByEmail();
      fetchBusinessCooperation();
      fetchHelpCenter();
      fetchAbout();
    }
  }, [user?.email]);

  const fetchQuestionsAnswerByEmail = async () => {
    try {
      const response = await axios.get('https://grozziieget.zjweiting.com:8033/tht/QandAnswers', {
        params: {
          email: user?.email,
        },
      });
      setQuestionsAnswer(response.data);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  const fetchAbout = async (id) => {
    try {
      const response = await axios.get(`https://grozziieget.zjweiting.com:8033/tht/about`);
      console.log(response.data[0])
      setAbout(response.data[0]?.about);
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };
  const fetchHelpCenter = async (id) => {
    try {
      const response = await axios.get(`https://grozziieget.zjweiting.com:8033/tht/helpCenter`);
      console.log(response.data[0])
      setHelpCenter(response.data[0]?.helpCenter);
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };
  const fetchBusinessCooperation = async (id) => {
    try {
      const response = await axios.get(`https://grozziieget.zjweiting.com:8033/tht/businessCooperation`);
      console.log(response.data[0])
      setBusinessCooperatin(response.data[0]?.businessCooperation);
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };




  //create a function to delete a user from the frontend and database both side 
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://grozziieget.zjweiting.com:8033/tht/QandAnswers/delete/${userId}`);
      toast.success('Question Answer deleted successfully');
      setQuestionsAnswer(questionAnswer.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  // const handleDelete = async (userId) => {
  //   try {
  //     // Assuming you have a token stored in localStorage or wherever you keep it


  //     const response = await axios.delete(`https://grozziie.zjweiting.com:3086/tht/QandAnswers/delete/${userId}`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Access-Control-Allow-Origin': 'https://grozziie.zjweiting.com:3086',
  //       },
  //     });

  //     // Assuming the server responds with a success status
  //     if (response.status === 200) {
  //       toast.success('Question Answer deleted successfully');
  //       setQuestionsAnswer(questionAnswer.filter((user) => user.id !== userId));
  //     } else {
  //       // Handle other response statuses if necessary
  //       toast.error('Failed to delete user');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //     toast.error('Failed to delete user');
  //   }
  // };





  //create a function to update a user from the frontend and database both side 
  const updateUser = async (userId, editingUser) => {
    try {
      const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/QandAnswers/update/${userId}`, editingUser);
      toast.success("user information updated successfully");
      // Optionally, you can show a success message to the user using a toast or other UI notification.
    } catch (error) {
      toast.error('Error updating user:', error);
      // Optionally, you can show an error message to the user using a toast or other UI notification.
    }
  };
  // const saveUser = (userId,updatedUser) => {
  //   updateUser(userId, updatedUser);
  //   setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
  //   setEditingUser(null);
  // };








  function handleSubmit(event) {
    event.preventDefault();

    if (user && question && answer) {
      // extract the current date and time components
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      //load current user data from database
      fetch('https://grozziieget.zjweiting.com:8033/tht/QandAnswers/add', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ email: user?.email, question: question, answer: answer, date: date, time: time })
      })
        .then(res => res.json())
        .then(data => {
          if (data?.insertId) {
            toast.success('Questions answer stored Successfully');
            setQuestionsAnswer([...questionAnswer, { email: user?.email, question: question, answer: answer, date: date, time: time }]);
            setQuestion("");
            setAnswer("");


          }
          else {
            toast.error(data.message);
          }

        })

    }
    else {
      toast.error("please add question and answer in input field")
    }

  }



  const handleEdit = async (id, editedQuestion, editedAnswer, editedDate, editedTime) => {
    setQuestionsAnswer(questionAnswer.map(questionAnswer => {
      if (questionAnswer.id === id) {
        return {
          ...questionAnswer,
          question: editedQuestion,
          answer: editedAnswer,
          date: editedDate,
          time: editedTime
        };
      }
      return questionAnswer;
    }));
    try {
      const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/QandAnswers/update/${id}`, { editedQuestion, editedAnswer, editedDate, editedTime });
      toast.success("user information updated successfully");
      // Optionally, you can show a success message to the user using a toast or other UI notification.
    } catch (error) {
      toast.error('Error updating user:', error);
      // Optionally, you can show an error message to the user using a toast or other UI notification.
    }
  };


  const handleToUpdateAbout = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/about/update`, {
        about
      });
      toast.success('About information updated');
    } catch (error) {
      toast.error('Error updating about information:', error);
    }
  }


  const handleToUpdateHelpCenter = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/helpCenter/update`, {
        helpCenter
      });
      toast.success('Help Center information updated');
    } catch (error) {
      toast.error('Error updating about information:', error);
    }
  }


  const handleToUpdateBusinessCooperation = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/businessCooperation/update`, {
        businessCooperation
      });
      toast.success('Business Cooperation information updated');
    } catch (error) {
      toast.error('Error updating about information:', error);
    }
  }


  return (
    <div className="mx-2 md:mx-20 my-5 md:my-32 text-gray-800">
      <div className="mb-32">

        <h1 className="mb-10 text-3xl font-bold text-[#004368] my-5 mt-10 ">
          Add Questions & Answer Part
        </h1>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4 X">
            <label className="block  mb-2 pl-2 text-start text-gray-600" htmlFor="name">
              Question:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="question"
              type="text"
              placeholder="Please input question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block  mb-2 pl-2 text-start text-gray-600" htmlFor="email">
              Answer
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline bg-white"
              id="answer"
              type="text"
              placeholder="Please input answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-[#004368]  hover:bg-blue-700 text-white font-bold py-2 px-20 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
        <div>
          <h1 className="mt-32 mb-10 text-3xl font-bold text-[#004368] my-5">
            Questions And Answer list
          </h1>


          <QuestionAnswerTable
            onDelete={handleDelete}
            onEdit={handleEdit}
            questionAnswers={questionAnswer}
          ></QuestionAnswerTable>
        </div>

      </div>

      {/* Add Support Link part start from here */}
      <SupportLinkManagement></SupportLinkManagement>


      {/* Add about part start from here */}

      <h1 className="mt-32 mb-10 text-3xl font-bold text-[#004368] my-5 ">
        Add About Section
      </h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" >
        <div className="mb-4 X">
          <label className="block  mb-2 pl-2 text-start text-gray-600" htmlFor="name">
            About:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="question"
            type="text"
            placeholder="Please input about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-[#004368]  hover:bg-blue-700 text-white font-bold py-2 px-20 rounded focus:outline-none focus:shadow-outline"
            onClick={handleToUpdateAbout}
          >
            Update About
          </button>
        </div>
      </form>
      <div>
        <h1 className="mt-32 mb-10 text-3xl font-bold text-[#004368] my-5">
          Show about description
        </h1>
        <p className="text-start p-4 border-gray-500 border-4">
          {about}
        </p>
      </div>
      {/* Add Help Center part start from here */}

      <h1 className="mt-32 mb-10 text-3xl font-bold text-[#004368] my-5 ">
        Add Help Center Section
      </h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4 X">
          <label className="block  mb-2 pl-2 text-start text-gray-600" htmlFor="name">
            Help Center:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="question"
            type="text"
            placeholder="Please input Help Center"
            value={helpCenter}
            onChange={(e) => setHelpCenter(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-[#004368]  hover:bg-blue-700 text-white font-bold py-2 px-20 rounded focus:outline-none focus:shadow-outline"
            onClick={handleToUpdateHelpCenter}
          >
            Update Help Center
          </button>
        </div>
      </form>
      <div>
        <h1 className="mt-32 mb-10 text-3xl font-bold text-[#004368] my-5 ">
          Show Help Center description
        </h1>
        <p className="text-start p-4 border-gray-500 border-4">
          {helpCenter}
        </p>
      </div>


      {/* Add Business Cooperation part start from here */}

      <h1 className="mt-32 mb-10 text-3xl font-bold text-[#004368] my-5 ">
        Update Business Cooperation Section
      </h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" >
        <div className="mb-4 X">
          <label className="block  mb-2 pl-2 text-start text-gray-600" htmlFor="name">
            Business Cooperation:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="question"
            type="text"
            placeholder="Please input Business Cooperation"
            value={businessCooperation}
            onChange={(e) => setBusinessCooperatin(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-[#004368]  hover:bg-blue-700 text-white font-bold py-2 px-20 rounded focus:outline-none focus:shadow-outline"
            onClick={handleToUpdateBusinessCooperation}
          >
            Update Business Cooperation
          </button>
        </div>
      </form>
      <div>
        <h1 className="mt-32 mb-10 text-3xl font-bold text-[#004368] my-5">
          Show Business Cooperation description
        </h1>
        <p className="text-start p-4 border-gray-500 border-4">
          {businessCooperation}
        </p>
      </div>
    </div>
  );
}

export default QandA;
