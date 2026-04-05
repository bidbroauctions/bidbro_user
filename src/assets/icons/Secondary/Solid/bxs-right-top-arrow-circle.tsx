import React from "react";

const BxsArrowCircle = ({
  color,
  direction = "right_top", // Default direction
}: {
  color: string;
  direction?: "right_top" | "right_bottom"; // Optional, defaults to right_top
}) => {
  // Define the angle of rotation based on direction
  const getRotation = () => {
    const deg = 270;
    switch (direction) {
      case "right_bottom":
        return `${-deg}`; // Rotate -45 degrees for bottom-right
      default:
        return "0"; // No rotation by default (in case of unexpected values)
    }
  };

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${getRotation()}deg)` }} // Apply rotation here
    >
      <path
        d="M15.8925 4.10751C12.6433 0.859181 7.35666 0.859181 4.10666 4.10751C0.858327 7.35668 0.858327 12.6442 4.10666 15.8933C7.35583 19.1417 12.6425 19.1417 15.8925 15.8933C19.1417 12.6433 19.1417 7.35668 15.8925 4.10751ZM12.9458 12.9467L10.5892 10.5892L7.64333 13.5358L6.46499 12.3575L9.41083 9.41085L7.05416 7.05335H12.9458V12.9467Z"
        fill={color}
      />
    </svg>
  );
};

export default BxsArrowCircle;
