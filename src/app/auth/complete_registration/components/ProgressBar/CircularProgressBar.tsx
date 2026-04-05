import React from "react";

interface CircularProgressProps {
  progress: number; // The percentage (e.g., 60 for 60%)
  size?: number; // Size of the circle
  strokeWidth?: number; // Thickness of the circle
  renderText?: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 120, // Default size of 120px
  strokeWidth = 10, // Default thickness of 10px
  renderText,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle (light green) */}
      <svg className="absolute top-0 left-0" width={size} height={size}>
        <circle
          className="text-[#E0F2F1]" // Light green background
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      {/* Progress circle (dark green) */}
      <svg className="absolute top-0 left-0" width={size} height={size}>
        <circle
          className="text-[#26A69A]" // Dark green progress
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: "stroke-dashoffset 0.35s" }}
        />
      </svg>

      {/* Centered text */}
      <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-xl font-semibold text-gray-700">
        {renderText || `${progress}%`}
      </div>
    </div>
  );
};

export default CircularProgress;
