import React, { useContext, useState } from 'react';
import { Form, Link, Navigate, useNavigate } from 'react-router-dom';
import { GrFacebook, GrGoogle } from "react-icons/gr";
import { BsEyeFill, BsWechat } from "react-icons/bs";
import { RiEyeCloseLine } from 'react-icons/ri';
import { AuthContext } from '../../../context/UserContext';
import registerLogo from "../../../Assets/Images/Register/register-logo.jpg"
import googleLogo from "../../../Assets/Images/Icons/gmailLogo.jpg"
import facebookLogo from "../../../Assets/Images/Icons/facebookLogo.png"
import wechatLogo from "../../../Assets/Images/Icons/wechatLogo.png"
import AddFile from "../../../Assets/Images/Icons/AddFile.jpg"


// upload image
import { useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import BtnSpinner from '../../Shared/Loading/BtnSpinner';





const Register = () => {
    const { setUser, setChattingUser, setServiceCountry, serviceCountry } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    //create different kind of state to get the current value
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [designation, setDesignation] = useState('');
    const [country, setCountry] = useState('');
    const [language, setLanguage] = useState('');

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [matchError, setMatchError] = useState(null);
    const [lengthError, setLengthError] = useState(null);

    const [fileError, setFileError] = useState(null);
    const [allUsers, setAllUsers] = useState([]);

    const [userExists, setUserExists] = useState(false);



    // axios.get('https://grozziieget.zjweiting.com:8033/tht/allUsers')
    //     .then(response => {
    //         setAllUsers(response.data);

    //     })
    //     .catch(error => {
    //         console.log(error);

    //     });




    //use this function to navigate the route after registration
    const navigate = useNavigate();


    //create these functions to get the input value
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);

    };
    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };
    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };
    const handleDesignationChange = (event) => {
        setDesignation(event.target.value);
    };
    const handleCountryChange = (event) => {
        setCountry(event.target.value);
    };



    // create this function to upload image
    const handleFileUpload = useCallback(async (acceptedFiles) => {
        const apiKey = process.env.REACT_APP_IMG_BB_API_KEY;
        const formData = new FormData();
        formData.append('image', acceptedFiles[0]);
        try {
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${apiKey}`,
                formData
            );
            setImage(response.data.data.display_url)
            toast.success("Image prepare for use successfully")
        } catch (error) {
            console.log(error);
            toast.error(error)
        }
    }, []);


    //create this function to select and drop any image to host
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length === 0) {
            setFileError('Please select a file.');
        } else if (acceptedFiles[0].type !== 'image/jpeg' && acceptedFiles[0].type !== 'image/png') {
            setFileError('Please select a JPG or PNG image.');
        } else {
            setFileError(null);
            handleFileUpload(acceptedFiles);
        }
    }, [handleFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png',
    });


    //create this function to show the password toggle
    const handleToShowPassword = (event) => {
        event.preventDefault();
        setShowPassword(!showPassword)
    };
    const handleToShowConfirmPassword = (event) => {
        event.preventDefault();
        setShowConfirmPassword(!showConfirmPassword)
    };



    //Registration part with firebase start here------------------------

    //get this value by useContext from AuthContext
    const { createUser, signInWithGoogle, signInWithFacebook } = useContext(AuthContext)

        //create a submit function to create user and store user information in Sql database
        ;





    const handleSubmit = (event) => {
        event.preventDefault();

        const chatRegistration = {
            userName: name,
            userEmail: email,
            phone: phone,
            userPassword: password,
            role: "user",
            designation: designation,
            country: country,
            addresses: []
        }





        if (name === "" || phone === "" || country === "" || language === "" || email === "" || designation === "") {
            toast.error("Please provide all the information");
            return;
        }
        setLoading(true);
        const user = {
            name,
            image,
            phone,
            country,
            language,
            email,
            designation,
        };

        const form = event.target;

        fetch('https://grozziieget.zjweiting.com:8033/tht/check-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
            .then((response) => response.json())
            .then((data) => {
                const userExists = data.exists;


                if (userExists === false) {
                    // Validate password length
                    if (password.length < 8) {
                        setLengthError("Your password must be at least 8 characters long");
                        setLoading(false);
                        return;
                    }

                    // Validate password match
                    if (password !== confirmPassword) {
                        setMatchError("Your passwords do not match");
                        setLoading(false);
                        return;
                    }

                    fetch('https://grozziieget.zjweiting.com:8033/tht/users/add', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            name,
                            image,
                            phone,
                            country,
                            language,
                            email,
                            password,
                            designation,
                            isAdmin: "false",
                        }),
                    })
                        .then((res) => res.json())
                        .then(async (data) => {
                            if (data) {
                                localStorage.setItem('user', JSON.stringify(user));
                                localStorage.setItem('serviceCountry', JSON.stringify(serviceCountry));
                                setUser(user);
                                // setLoading(false);
                                //         toast.success("Registration complete Successfully");
                                //         form.reset();
                                //         navigate("/");



                                try {
                                    const url = serviceCountry === "EN"
                                        ? 'https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/signUp'
                                        : 'https://jiapuv.com:3091/CustomerService-ChatCN/api/dev/user/signUp';

                                    const response = await axios.post(url, chatRegistration);

                                    if (response) {
                                        localStorage.setItem('chattingUser', JSON.stringify({
                                            userName: name,
                                            userId: response?.data?.userId,
                                            userEmail: email,
                                            role: "user",
                                            designation: designation,
                                            country: country
                                        }));
                                        setChattingUser({
                                            userName: name,
                                            userId: response?.data?.userId,
                                            userEmail: email,
                                            role: "user",
                                            designation: designation,
                                            country: country
                                        });
                                        setLoading(false);
                                        form.reset();
                                        navigate("/");
                                    } else {
                                        toast.error(response.data.message);
                                        setLoading(false);
                                    }
                                } catch (error) {
                                    console.error("Chatting Registration Error", error);
                                    toast.error("Chatting Registration failed");
                                    setLoading(false);
                                }
                            } else {
                                toast.error(data.message);
                                setLoading(false);
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                            toast.error("An error occurred during registration");
                            setLoading(false);
                        });
                } else {
                    toast.error("This email already has an account");
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error("An error occurred while checking user existence");
                setLoading(false);
            });
    };



    // create a function to google authentication system
    const handleToGoogleLogIn = () => {
        signInWithGoogle()
            .then(result => {
                const user = result.user;
                if (user) {
                    toast.success("Log In Successfully")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    // create a function to facebook authentication system
    const handleToFaceBookLogIn = () => {
        signInWithFacebook()
            .then(result => {
                const user = result.user;
                if (user) {
                    toast.success("Log In Successfully")
                }

                Navigate("/")

            })
            .catch(err => {
                console.log(err)
            })
    }


    return (
        <div className="md:flex shadow-lg justify-around items-center  md:mx-20 sm:px-5 px-3  lg:mx-48 my-20 rounded-lg">
            <div className="bg-white text-gray-800 flex justify-center items-center w-full md:w-5/6 lg:w-2/5  ">
                <div className=" w-full my-12" >
                    <h2 className="text-2xl mb-6 text-[#004368] font-semibold my-4">Create an account</h2>

                    <div className="text-2xl" >
                        <button onClick={handleToGoogleLogIn} className="mr-8">
                            <img className="h-9 w-9" src={googleLogo} alt='google'></img>
                        </button>
                        <button onClick={handleToFaceBookLogIn} className="mr-8">
                            <img className="h-9 w-9" src={facebookLogo} alt='facebook'></img>
                        </button>
                        <button>
                            <img className="h-9 w-9" src={wechatLogo} alt='wechat'></img>
                        </button>
                    </div>

                    <div className="my-2 text-slate-500">or</div>
                    <form onSubmit={handleSubmit}>

                        <input className=" w-full pl-2 bg-white text-gray-800" placeholder="username or email" type="email" id="email" value={email} onChange={handleEmailChange} />
                        <hr className=" border-slate-400 mb-6 my-1" ></hr>


                        <div className='relative my-2'>
                            <div className='flex items-center '>
                                <input className=" w-full pl-2 bg-white text-gray-800" placeholder="password" type={showPassword ? "text" : "password"} id="password" value={password} onChange={handlePasswordChange} />
                                <button className="absolute right-0 pr-2" onClick={handleToShowPassword}>
                                    {
                                        showPassword ? <BsEyeFill className="text-slate-500"></BsEyeFill> : <RiEyeCloseLine className="text-slate-500"></RiEyeCloseLine>
                                    }

                                </button>
                            </div>

                            <hr className=" border-slate-400 mb-6 my-1" ></hr>
                            <p className="text-xs text-red-600 ml-2 text-start">{lengthError}</p>
                        </div>


                        <div className='relative my-2'>
                            <div className='flex items-center'>
                                <input className=" w-full pl-2 bg-white text-gray-800" placeholder="confirm password" type={showConfirmPassword ? "text" : "password"} id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                                <button className="absolute right-0 pr-2" onClick={handleToShowConfirmPassword}>
                                    {
                                        showConfirmPassword ? <BsEyeFill className="text-slate-500"></BsEyeFill> : <RiEyeCloseLine className="text-slate-500"></RiEyeCloseLine>
                                    }

                                </button>
                            </div>

                            <hr className=" border-slate-400 mb-6 my-1" ></hr>
                            <p className="text-xs text-red-600 ml-2 text-start">{matchError}</p>
                        </div>



                        <input className=" w-full pl-2 bg-white text-gray-800" placeholder="your name" type="text" id="name" value={name} onChange={handleNameChange} />
                        <hr className=" border-slate-400 mb-6 my-1" ></hr>


                        <input className=" w-full pl-2 bg-white text-gray-800" placeholder="phone number" type="digit" id="phone" value={phone} onChange={handlePhoneChange} />
                        <hr className=" border-slate-400 mb-6 my-1" ></hr>


                        <input className=" w-full pl-2 bg-white text-gray-800" placeholder="Designation" type="text" id="designation" value={designation} onChange={handleDesignationChange} />
                        <hr className=" border-slate-400 mb-6 my-1" ></hr>

                        <div className="flex justify-start mb-10 pl-2 bg-white">
                            <label>Language:</label>
                            <select className="bg-white"
                                value={serviceCountry}
                                onChange={(e) => setServiceCountry(e.target.value)}
                            >
                                <option value="EN">English</option>
                                <option value="CN">Chinese</option>
                            </select>
                        </div>

                        <input className=" w-full pl-2 bg-white text-gray-800" placeholder="country" type="text" id="country" value={country} onChange={handleCountryChange} />
                        <hr className=" border-slate-400 mb-6 my-1" ></hr>

                        <input className=" w-full pl-2 bg-white text-gray-800" placeholder="native language" type="text" id="language" value={language} onChange={handleLanguageChange} />
                        <hr className=" border-slate-400 mb-8" ></hr>




                        <div
                            {...getRootProps()}
                            className="mb-10"
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p className="text-lg font-medium text-gray-500">Drop the files here ...</p>
                            ) : (
                                <>
                                    <div className="w-full h-10 flex items-center pl-2 shadow-lg cursor-pointer text-slate-400 rounded-md border  ">
                                        <div>
                                            <img className="w-6 h-6 " src={AddFile}></img>
                                        </div>
                                        <div className="ml-3">
                                            Add Image
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {fileError && <p className="mt-2 text-sm text-red-500">{fileError}</p>}



                        <div className="my-2 ">
                            <button className="bg-[#004368] text-white w-full py-2 text-xl font-semibold rounded-md" type="submit">
                                {
                                    !loading ?
                                        "Register"
                                        : <BtnSpinner></BtnSpinner>
                                }
                            </button>
                        </div>


                    </form>
                    <div className="text-sm my-3">
                        Already have an account? <Link className="font-semibold text-[#65ABFF]" to="/login">Sign In</Link>
                    </div>


                </div>

            </div>

            <div className=" sm:hidden lg:block flex items-center justify-center">
                <img className="h-3/4 w-2/3" src={registerLogo} alt='RegisterLogo' ></img>

            </div>

        </div>
    );
};

export default Register;