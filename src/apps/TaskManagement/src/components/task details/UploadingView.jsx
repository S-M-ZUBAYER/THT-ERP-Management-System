import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SvgRollerLoader from "../svg/SvgRollerLoader";

const UploadingView = () => {
  const rippleRef = useRef(null);
  const uploadingPageRef = useRef(null);

  useEffect(() => {
    const ripple = rippleRef.current;
    const uploadingPage = uploadingPageRef.current;

    const timeline = gsap.timeline();

    timeline.fromTo(
      ripple,
      {
        scale: 0.2,
        opacity: 0.4,
      },
      {
        scale: 2.5,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    );

    timeline.fromTo(
      uploadingPage,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      },
      "+=0"
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-60 relative">
      <div
        ref={rippleRef}
        className="absolute w-40 h-40 rounded-full border-4 border-blue-200 z-0"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      ></div>

      <div
        ref={uploadingPageRef}
        className="flex flex-col items-center space-y-4 z-10 opacity-0"
      >
        <SvgRollerLoader size={100} strokeWidth={10} color="#004368" />
        <span className="text-gray-800 text-xl font-mono">Uploading...</span>
      </div>
    </div>
  );
};

export default UploadingView;
