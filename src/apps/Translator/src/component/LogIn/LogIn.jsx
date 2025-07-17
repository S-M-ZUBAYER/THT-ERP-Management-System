import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LogIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [language, setLanguage] = useState("en"); // Default English
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)



    const translations = {
        en: {
            title: "Login",
            email: "Email",
            password: "Password",
            selectLanguage: "Select Language",
            loginButton: "Login",
        },
        zh: {
            title: "登录",
            email: "电子邮件",
            password: "密码",
            selectLanguage: "选择语言",
            loginButton: "登录",
        },
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if (email === "" || password === "") {
            toast.error("please input all the information properly")
            return;
        }
        setLoading(true);
        const form = event.target;
        // handle form submission logic here
        fetch('https://grozziieget.zjweiting.com:8033/tht/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
            .then(res => res.json())
            .then(async data => {

                if (data?.message === "Wrong email/password combination!") {
                    toast.error(data.message);
                    setLoading(false);
                }
                else if (data?.message === "User doesn't exist") {
                    toast.error(data.message);
                    setLoading(false);
                }
                else {
                    // setUser(data[0])
                    localStorage.setItem('user', JSON.stringify(data[0]));
                    setLoading(false);
                    // navigate(from, { replace: true })
                    navigate("/")
                    form.reset();
                    toast.success('User Login Successfully');
                }

            })




            // signIn(email,password)
            // .then(result=>{
            //     const user=result.user;
            //     setLoading(false);
            //     navigate(from,{replace:true})
            //     form.reset();

            // })
            .catch(err => {
                // toast.error("Invalid User Name Or Password")
                console.log(err);
                setLoading(false);
            })
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">{translations[language].title}</h2>

                {/* Language Selection */}
                <label className="block mb-2 font-medium">{translations[language].selectLanguage}:</label>
                <select
                    className="w-full p-2 border rounded mb-4"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                </select>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 font-medium">{translations[language].email}:</label>
                    <input
                        type="email"
                        className="w-full p-2 border rounded mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="block mb-2 font-medium">{translations[language].password}:</label>
                    <input
                        type="password"
                        className="w-full p-2 border rounded mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#004368] text-white py-2 rounded hover:bg-[#122f42]"
                    >
                        {loading ? "Loading" : translations[language].loginButton}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LogIn;
