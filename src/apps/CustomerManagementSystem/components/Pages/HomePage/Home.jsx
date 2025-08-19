import React, { useEffect } from "react";
import img1 from "../../../Assets/Images/THT/THT_Home.jpg";
import img2 from "../../../Assets/Images/THT/THT_Service.jpg";
import { SiShopee } from "react-icons/si";
import lazadaImg from "../../../Assets/Images/Lazada/lagada_pic.jpg";
import Carousel from "./Carousel";
import { Link } from "react-router-dom";

const Home = () => {
  console.log("home from customer");

  return (
    <div>
      <Carousel></Carousel>

      <div className="relative">
        <div className="w-96 h-96 rounded-full bg-[#78c9f5] blur-3xl absolute right-0 top-52"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:mt-20 md:mx-28">
          <div className="px-6  z-40 md:px-20 text-center text-gray-950">
            <h1 className="pt:5 md:pt-20 text-xl md:text-2xl font-bold my-3 text-start ">
              About our company{" "}
            </h1>
            <p className="text-start">
              Welcome to , your one-stop-shop for all your printing needs! We
              are dedicated to providing high-quality printing products and
              services that will exceed your expectations.Our state-of-the-art
              printers are designed to produce crisp, clear, and vibrant prints
              for both personal and professional use.{" "}
            </p>
          </div>
          <div className="flex items-center justify-self-center md:mr-20">
            <img
              className="h-96 w-80 z-40 rounded-2xl shadow-xl"
              src={img1}
              alt=""
            />
          </div>
        </div>
      </div>

      <div className=" relative">
        <div className="w-[500px] h-[500px]  rounded-full bg-[#78c9f5] blur-3xl absolute bottom-1 "></div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:mt-20 gap-5 md:mx-32 py-12">
          <div className="order-2 sm:order-1 flex items-center justify-self-center md:justify-start md:ml-20">
            <img
              className="h-96 w-80 z-40 rounded-2xl shadow-xl"
              src={img2}
              alt=""
            />
          </div>
          <div className="px-6 z-40 md:px-20 order-1 sm:order-2px-20 text-center md:text-start md:ml-16 text-gray-950">
            <h1 className="sm:pt-0 md:pt-20 text-2xl font-bold my-2 ">
              Our Service{" "}
            </h1>
            <p className=" text-clip sm:pb-20">
              Welcome to , your one-stop-shop for all your printing needs! We
              are dedicated to providing high-quality printing products and
              services that will exceed your expectations.Our state-of-the-art
              printers are designed to produce crisp, clear, and vibrant prints
              for both personal and professional use.{" "}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h1 className="text-xl font-semibold text-gray-950">
          Buy product from
          {/* https://shopee.com.my/search?keyword=grozzie */}
        </h1>
        <div className="my-12 flex justify-around">
          <Link
            to="https://shopee.com.my/grozziie_printer?categoryId=100644&itemId=18702252991"
            target="_blank"
            className="flex"
          >
            <SiShopee className="text-3xl mr-2 text-orange-500"></SiShopee>
            <h2 className="font-semibold text-2xl text-orange-500">Shopee</h2>
          </Link>
          <Link
            to="https://www.lazada.com.my/shop/shinprinter"
            target="_blank"
            className="flex items-center"
          >
            {/* <BsFillSuitHeartFill className="text-2xl mr-2"></BsFillSuitHeartFill>
                        <h2 className="font-semibold text-xl text-blue-900">Lazada</h2> */}
            <img className="h-8" src={lazadaImg}></img>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
