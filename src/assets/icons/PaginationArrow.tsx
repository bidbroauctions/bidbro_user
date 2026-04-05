import React from "react";

const PaginationArrow = ({
  direction = "left",
  isActive = false,
}: {
  direction?: "right" | "left";
  isActive?: boolean;
}) => {
  const deg = direction === "right" ? "0" : "180";
  return (
    <svg
      width="10"
      height="14"
      viewBox="0 0 10 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ rotate: `${deg}deg` }}
    >
      <path
        opacity={isActive ? "1" : "0.5"}
        d="M9.25 12.9595L0.863201 7L9.25 1.04047V12.9595Z"
        fill="#F68B36"
        stroke="#F68B36"
      />
    </svg>
  );
};

export default PaginationArrow;
