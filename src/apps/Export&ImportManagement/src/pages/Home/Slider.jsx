import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
// import slider01 from "../../assets/slider/slider01.jpg";
// import slider02 from "../../assets/slider/slider02.jpg";
// import slider03 from "../../assets/slider/slider03.jpg";
// import slider04 from "../../assets/slider/slider04.jpg";
// import slider05 from "../../assets/slider/slider05.jpg";
// import slider06 from "../../assets/slider/slider06.jpg";

const Slider = () => {
  // slider Images link for slide show
  const slides = useMemo(
    () => [
      {
        url: "https://images.unsplash.com/photo-1611117775350-ac3950990985?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1582879304171-8041c73bedbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1624451322519-ba906641a097?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1621954938124-02e637ba3584?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides]);

  // const nextSlide = () => {
  //   const isLastSlide = currentIndex === slides.length - 1;
  //   const newIndex = isLastSlide ? 0 : currentIndex + 1;
  //   setCurrentIndex(newIndex);
  // };

  const autoPlayInterval = 4000; // Set the auto-play interval (in milliseconds)

  useEffect(() => {
    const autoPlayTimer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      clearInterval(autoPlayTimer);
    };
  }, [currentIndex, nextSlide]);

  return (
    <div className="max-w-full h-[500px] lg:h-[720px] w-full pt-1 relative group">
      <div
        className="w-full h-full rounded-xl bg-center bg-cover duration-500"
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}></div>
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer ">
        <BsChevronCompactLeft size={30} className="" onClick={prevSlide} />
      </div>
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer ">
        <BsChevronCompactRight size={30} className="" onClick={nextSlide} />
      </div>
    </div>
  );
};

export default Slider;
