import React, { useState } from "react";
import toast from "react-hot-toast";
import emailjs from "emailjs-com";
import world from "../assets/WebsiteImages/world.png";
import Navbar from "./SharedPage/Navbar";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    country: "",
    message: "",
  });

  const emailServiceId = import.meta.env.VITE_EMAIL_JS_SERVICE_ID;
  const emailTemplateId = import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID;
  const emailPublicKey = import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.send(
        emailServiceId, // ✅ Your service ID
        emailTemplateId, // ✅ Your template ID
        formData, // ✅ Must match variable names in EmailJS template
        emailPublicKey // ✅ Your public key
      );

      setLoading(false);
      toast.success("✅ Thank you! Your message has been sent.");
      setFormData({ userName: "", email: "", country: "", message: "" });
    } catch (error) {
      console.error("❌ Email failed:", error);
      setLoading(false);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="mx-auto mt-10 min-h-screen  max-w-[90rem]">
      <Navbar></Navbar>
      <div className="grid grid-cols-5 gap-x-1 pt-12">
        {/* Right side */}
        <div className="col-span-3 flex flex-col">
          <div className="flex flex-col px-20 mb-3">
            <h1 className="text-[#004368] text-5xl font-bold leading-tight">
              Let’s Talk
            </h1>
            <p className="mt-3 mb-6 text-xl">
              Have some big idea or brand to develop and need help? Then reach
              out we'd love to hear about your project and provide help
            </p>
            <h3 className="text-xl mb-2 font-bold">Support Email</h3>
            <p className="text-[#004368]">info@printernoble.com</p>
          </div>
          <div className="mt-6">
            <img src={world} alt="World" />
          </div>
        </div>

        {/* Left side (form) */}
        <div className="md:col-span-2 mt-8">
          <form
            className="w-full bg-white  rounded-xl p-6 "
            onSubmit={handleSubmit}
          >
            {/* Name */}
            <div className="mb-6">
              <label className="block mb-2 text-[#004368] text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                name="userName"
                required
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter User Name"
                className="w-full text-black text-opacity-70 text-[15px] px-3 py-2 bg-[#004368]/5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#004368] focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block mb-2 text-[#004368] text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full text-black text-opacity-70 text-[15px] px-3 py-2 bg-[#004368]/5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#004368] focus:border-transparent transition"
              />
            </div>

            {/* Country */}
            <div className="mb-6">
              <label className="block mb-2 text-[#004368] text-sm font-medium">
                Country
              </label>
              <input
                type="text"
                name="country"
                required
                value={formData.country || ""}
                onChange={handleChange}
                placeholder="Enter Country"
                className="w-full text-black text-opacity-70 text-[15px] px-3 py-2 bg-[#004368]/5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#004368] focus:border-transparent transition"
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block mb-2 text-[#004368] text-sm font-medium">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                required
                onChange={handleChange}
                placeholder="Your Message"
                className="w-full text-black text-opacity-70 text-[15px] px-3 py-2 bg-[#004368]/5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#004368] focus:border-transparent h-32 resize-none transition"
              ></textarea>
            </div>

            <div className="flex items-center justify-center">
              <button
                className="bg-[#004368] hover:bg-[#003150] cursor-pointer text-white w-full h-11 px-2 py-2 rounded-md text-center font-medium transition"
                type="submit"
              >
                {loading ? "submitting" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
