import React from "react";
import { BsLinkedin, BsWechat, BsFillTelephoneFill } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" bg-slate-200">
      <div className="footer  px-7 md:px-20 py-10 flex justify-around">
        <div className="text-base space-y-1">
          <span className="font-bold text-gray-500 text-base mb-4 block">
            Services
          </span>
          <p className="text-gray-600">Customer Care</p>
          <p className="text-gray-600">Translator</p>
          <p className="text-gray-600">Marketing</p>
          <p className="text-gray-600">Data Analysis</p>
        </div>

        <div className="space-y-1 text-base">
          <span className="font-semibold text-gray-500 text-base mb-4 block">
            Company
          </span>
          <p className="text-gray-600">About us</p>
          <p className="text-gray-600">Contact</p>
          <p className="text-gray-600">Jobs</p>
          <p className="text-gray-600">Press kit</p>
        </div>

        <div className="text-base space-y-1">
          <span className="font-semibold text-gray-500 text-base mb-4 block">
            Company
          </span>
          <p className="text-gray-600 ">Career</p>
          <p className="text-gray-600">Portal</p>
          <p className="text-gray-600">News</p>
          <p className="text-gray-600">Products</p>
        </div>

        <div className="">
          <span className=" font-bold text-gray-500 text-base mb-2">
            Contact Us
          </span>
          <div className="flex justify-start items-center gap-6 mb-2 mt-4">
            <a
              href="https://bd.linkedin.com/company/thtuepz"
              className="cursor-pointer"
              rel="opener"
            >
              <BsLinkedin className="w-4 h-4 rounded" />
            </a>
            <a
              href="https://www.facebook.com/thtUEPZ/"
              className="cursor-pointer"
              rel="opener"
            >
              <FaFacebookSquare className="w-4 h-4 rounded" />
            </a>
            <a
              href="https://www.wechat.com/"
              rel="opener"
              className="cursor-pointer"
            >
              <BsWechat className="w-4 h-4 rounded" />
            </a>
          </div>
          <div className="text-base  text-gray-500 ">
            <div className="flex items-center gap-2 mb-1">
              <BsFillTelephoneFill className="w-4 h-4" />
              09638-322304
            </div>
            <div className="flex items-center gap-2">
              <AiOutlineMail className="w-4 h-4 rounded" />
              thtuepz@gmail.com
            </div>
          </div>
        </div>
      </div>
      <hr className="border solid h-[3px] w-3/4 mx-auto bg-sky-500" />
      <div className=" mt-5 text-lg flex items-center justify-center mx-16 mb-3">
        <div className="text-[15px]">
          <span className="font-semibold text-[16px]">&copy; 2023.</span> All
          rights reserved by THT-space electrical company Ltd.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
