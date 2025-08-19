import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { Link } from 'react-router-dom';
import img from "../../../Assets/Images/THT-Pic.jpg"
import customerServiceImg from "../../../Assets/Images/customer service/Customer service.jpg"
import axios from 'axios';

const Contact = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');


    const handleToSendEmail = (event) => {
        event.preventDefault();

        // Send email using EmailJS
        emailjs.send('service_7rnps2c', 'template_wt3urfs', {
            from_name: name,
            from_email: email,
            message: message,
        }, 'BdhgJg9oyaR8HBBNx')
            .then((result) => {
                alert("Send The sms Success fully")
                // TODO: Add success message or redirect to thank-you page
            })
            .catch((error) => {
                console.log(error.text);
                // TODO: Add error message
            });
    };

    // const EMAILJS_PUBLIC_KEY = "2rgeXzL7FMbdWdWdR"
    // const EMAILJS_PRIVATE_KEY = "yYsIzhaDA8jpFLDkRgKIv"
    // const EMAILJS_SERVICE_ID = "service_x46regr"
    // const EMAILJS_TEMPLATE_ID = "template_4b8fp8k"
    const EMAILJS_PUBLIC_KEY = "BdhgJg9oyaR8HBBNx"
    const EMAILJS_SERVICE_ID = "service_7rnps2c"
    const EMAILJS_TEMPLATE_ID = "template_wt3urfs"

    const handleToEmail = async () => {
        console.log("Click to send email");

        const templateParams = {
            to_email: "obaidulhoqejoy@gmail.com",
            from_email: "smzubayer9004@gmail.com",
            subject: "MultiVendor Subscription",
            message: "Your account has been created. Email: thtspace6@gmail.com, Password: 123456",
        };

        try {
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,   // Replace with your EmailJS Service ID
                EMAILJS_TEMPLATE_ID,  // Replace with your EmailJS Template ID
                templateParams,
                EMAILJS_PUBLIC_KEY    // Replace with your EmailJS Public Key
            );

            console.log("Email sent successfully:", response);
            alert("Email sent successfully!");
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please try again.");
        }
    };

    // const handleToEmail = async () => {
    //     console.log("Click to fetch email API");

    //     try {
    //         const response = await axios.get("http://localhost:2000/tht/version"); // Updated to GET request

    //         console.log("API Response:", response.data);
    //         alert("Email data fetched successfully!");
    //     } catch (error) {
    //         console.error("Error fetching email data:", error.response?.data || error.message);
    //         alert("Failed to fetch email data. Please try again.");
    //     }
    // };


    return (
        <div>
            <section
                className="relative max-w-[1700px] h-[780px] w-full bg-[url(https://lh3.googleusercontent.com/p/AF1QipP1Nu_aPfi17TVr41iSkP6kZLbZhWEUVNlEsKRW=s680-w680-h510)] bg-cover bg-center bg-no-repeat"
            >
                <div
                    className="absolute inset-0 bg-white/75 sm:bg-transparent sm:bg-gradient-to-r sm:from-white/95 sm:to-white/25"
                ></div>


                <div
                    className="relative mx-auto  px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8"
                >
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-extrabold text-lime-700 sm:text-5xl">
                            Please Contact

                            <strong className="block font-extrabold text-yellow-500">
                                THT-Space Electrical Company Ltd
                            </strong>
                            If You Need...

                        </h1>

                        <p className="mt-4 max-w-lg sm:text-xl text-cyan-800 sm:leading-relaxed">
                            Welcome to our THT-Space Electrical Company Ltd to see and check the product and any further reason...
                        </p>
                    </div>
                </div>
            </section>



            <div className="mt-20">
                <h1 className="text-black text-xl lg:text-3xl font-semibold mb-5">
                    Contact Us
                </h1>
                <p className=" text-gray-600">
                    If you need to get in touch with us, there are several ways to do so. You can reach out to us via email, phone, or through our website's contact form.
                </p>


                <div className="grid grid-cols-1 md:grid-cols-2 mt-10 mb-20">
                    <div className="flex justify-center md:justify-start items-center md:mx-10  md:mr-10">
                        <img className=" h-5/6 w-5/6 rounded-lg" src={customerServiceImg} alt='customer img'></img>
                    </div>
                    <div className=" md:text-start  md:ml-28 my-auto mx-auto">
                        <div className="my-5">
                            <h1 className="text-lg font-semibold mb-2 text-gray-600">
                                Head Office Address
                            </h1>
                            <p className="text-gray-600">
                                123 Chaowai St, Chaoyang District, Beijing,
                                China, 100020
                            </p>
                        </div>

                        <div className="my-5">
                            <h1 className="text-lg font-semibold mb-2 text-gray-600">
                                Contact Number
                            </h1>

                            <div className="text-gray-600">
                                <p className="mb-1">
                                    +000 12345 6789
                                </p>
                                <p className="mb-1">
                                    +000 12345 6789
                                </p>
                                <p className="mb-1">
                                    +000 12345 6789
                                </p>
                            </div>

                        </div>

                        <div className="my-5">
                            <h1 className="text-lg font-semibold mb-2 text-gray-600">
                                Contact Email
                            </h1>
                            <p className="text-gray-600">
                                smzubayer9004@gmail.com
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            <div>
                <button className="cursor-pointer text-black bg-slate-400 p-2" onClick={handleToEmail} >Send Email</button>
            </div>

            <div>
                <div className="w-5/6 md:w-4/6 lg:w-full mx-auto">
                    <h1 className="text-xl font-semibold text-black capitalize  lg:text-3xl">Let’s get in touch</h1>

                    <p className="mt-4 text-gray-600  ">
                        If you need to get in touch with us, there are several ways to do so. You can reach out to us via email, phone, or through our website's contact form.
                    </p>

                    <form onSubmit={handleToSendEmail} className="mt-12 text-slate-500">
                        <div className="-mx-2 md:items-center md:flex">
                            <div className="flex-1 px-2">
                                {/* <label className="block mb-2 text-sm text-gray-600 dark:text-gray-600">Full Name</label> */}
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)} className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600  dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                            </div>

                            <div className="flex-1 px-2 mt-4 md:mt-0">
                                {/* <label className="block mb-2 text-sm text-gray-600 dark:text-gray-600">Email address</label> */}
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)} className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600  dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                            </div>
                        </div>

                        <div className="w-full mt-4">
                            {/* <label className="block mb-2 text-sm text-gray-600 dark:text-gray-600">Message</label> */}
                            <textarea
                                id="message"
                                placeholder="Enter your message here"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)} className="block resize-none w-full h-32 px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md md:h-56 dark:placeholder-gray-600 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" ></textarea>
                        </div>

                        <button className=" px-20 py-1 my-10 mb-16 text-lg font-bold tracking-wide text-white capitalize transition-colors duration-300 transform  bg-[#004368]  rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                            Submit
                        </button>
                    </form>
                </div>


            </div>
        </div>
    );
};

export default Contact;