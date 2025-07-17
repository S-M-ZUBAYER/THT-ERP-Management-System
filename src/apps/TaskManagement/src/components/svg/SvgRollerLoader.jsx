import React from "react";

const SvgRollerLoader = ({
  size = 80,
  strokeWidth = 5,
  color = "#facc15",
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Circle */}
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
      </svg>

      {/* Growing Stroke Circle */}
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            animation: "drawFullCircle 2.5s ease-in-out forwards",
          }}
        />
      </svg>

      {/* Clock Icon */}
      <svg
        className="absolute inset-0 m-auto text-[#004368]"
        width={size * 0.25}
        height={size * 0.25}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 1.75A10.25 10.25 0 1 0 22.25 12 10.262 10.262 0 0 0 12 1.75Zm0 18.5a8.25 8.25 0 1 1 8.25-8.25 8.259 8.259 0 0 1-8.25 8.25Zm.625-8.875V7.5a.625.625 0 1 0-1.25 0v4a.625.625 0 0 0 .183.442l2.5 2.5a.625.625 0 1 0 .884-.884Z" />
      </svg>
    </div>
  );
};

export default SvgRollerLoader;
