import React,{ useState } from "react";
import Banner1 from '../../../Assets/Images/customer service/Customer service.jpg';
import Banner2 from '../../../Assets/Images/THT/THT-banner.png';
import Banner3 from '../../../Assets/Images/THT/THT_Home.jpg';
import Banner4 from '../../../Assets/Images/THT/THT_Service.jpg';
import Banner5 from '../../../Assets/Images/THT-Pic.jpg';
import { BsChevronCompactLeft,BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

function Carousel()
{

  const [activePointer, setActivePointer] = useState(0);
  
  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2620&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80',
    },

    {
      url: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex,e) => {
   setActivePointer(slideIndex);
     setCurrentIndex(slideIndex);
    
  };

  return (
    <div className='max-w-[1400px] h-[780px] w-full m-auto py-16 px-4  relative group'>
      <div className="text-start text-white absolute top-1/3 left-20">
        <h2 className="text-2xl font-semibold">
          WELCOME TO
        </h2>
        <h2 className="text-2xl font-bold">
          THT-SPACE ELECTRICAL COMPANY LTD.
        </h2>
        <p>
        Welcome to , your one-stop-shop for all your printing needs! We are dedicated to <br></br> providing high-quality printing products and services that will exceed.
        </p>
      </div>
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className='w-full h-full  bg-center bg-cover duration-500'
      ></div>
      {/* Left Arrow */}
      <div className='hidden  group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl  p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl  p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
      <div className='flex text-gray-200 top-4 inset-0 bg-white/75 sm:bg-transparent sm:bg-gradient-to-r sm:from-white/95 sm:to-white/25 justify-center items-center py-2'>
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            // className='text-2xl point cursor-pointer '
            className={`text-2xl point cursor-pointer  ${slideIndex === activePointer ? 'text-gray-800 text-3xl' : 'text-gray-300 text-2xl'}`}
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
}
export default Carousel;