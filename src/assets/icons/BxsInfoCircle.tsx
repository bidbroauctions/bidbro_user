import React from "react";

const BxsInfoCircle = ({ color }: { color?: string }) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2.5C6.486 2.5 2 6.986 2 12.5C2 18.014 6.486 22.5 12 22.5C17.514 22.5 22 18.014 22 12.5C22 6.986 17.514 2.5 12 2.5ZM13 17.5H11V11.5H13V17.5ZM13 9.5H11V7.5H13V9.5Z"
        fill={color || "#008774"}
      />
    </svg>
  );
};

export default BxsInfoCircle;
