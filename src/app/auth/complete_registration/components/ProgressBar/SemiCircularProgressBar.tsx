import React from "react";

interface SemiCircularProgressBarProps {
  currentStep: number;
  totalSteps: number;
  size?: number; // Size of the container for scaling (optional)
}

const SemiCircularProgressBar: React.FC<SemiCircularProgressBarProps> = ({
  currentStep,
  totalSteps,
  size = 104, // Default size matching the SVG viewBox
}) => {
  const progress = currentStep / totalSteps;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size * 0.95 }}
    >
      {progress === 0.5 ? (
        // Half filled progress (1 of 2)
        <svg
          width={size}
          height={size * 0.95}
          viewBox="0 0 104 99"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M98.8182 51.818C98.8182 45.6936 97.6072 39.6292 95.2544 33.971C92.9015 28.3129 89.4529 23.1717 85.1055 18.8411C80.758 14.5105 75.5968 11.0753 69.9165 8.73162C64.2363 6.38793 58.1483 5.18164 52 5.18164C45.8518 5.18164 39.7637 6.38792 34.0835 8.73161C28.4032 11.0753 23.242 14.5105 18.8946 18.8411C14.5471 23.1717 11.0985 28.3128 8.74566 33.971C6.39282 39.6292 5.18183 45.6936 5.18182 51.818"
            stroke="#EBEBEB"
            strokeWidth="10.3636"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.18182 51.818C5.18182 39.4493 10.1144 27.5871 18.8946 18.8411C27.6747 10.0951 39.5831 5.18164 52 5.18164"
            stroke="#009883"
            strokeWidth="10.3636"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : progress === 1 ? (
        // Full filled progress (2 of 2)
        <svg
          width={size}
          height={size * 0.95}
          viewBox="0 0 104 99"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M98.8181 51.818C98.8181 45.6936 97.6071 39.6292 95.2543 33.971C92.9015 28.3129 89.4529 23.1717 85.1054 18.8411C80.7579 14.5105 75.5967 11.0753 69.9165 8.73162C64.2362 6.38793 58.1482 5.18164 51.9999 5.18164C45.8517 5.18164 39.7637 6.38792 34.0834 8.73161C28.4032 11.0753 23.242 14.5105 18.8945 18.8411C14.547 23.1717 11.0984 28.3128 8.74559 33.971C6.39276 39.6292 5.18177 45.6936 5.18176 51.818"
            stroke="#EBEBEB"
            strokeWidth="10.3636"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.18176 51.818C5.18176 39.4493 10.1144 27.5871 18.8945 18.8411C27.6746 10.0951 39.583 5.18164 51.9999 5.18164C64.4169 5.18164 76.3253 10.0951 85.1054 18.8411C93.8855 27.5871 98.8181 39.4493 98.8181 51.818"
            stroke="#009883"
            strokeWidth="10.3636"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        // Default or no progress (0 of 2)
        <svg
          width={size}
          height={size * 0.95}
          viewBox="0 0 104 99"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M98.8182 51.818C98.8182 45.6936 97.6072 39.6292 95.2544 33.971C92.9015 28.3129 89.4529 23.1717 85.1055 18.8411C80.758 14.5105 75.5968 11.0753 69.9165 8.73162C64.2363 6.38793 58.1483 5.18164 52 5.18164C45.8518 5.18164 39.7637 6.38792 34.0835 8.73161C28.4032 11.0753 23.242 14.5105 18.8946 18.8411C14.5471 23.1717 11.0985 28.3128 8.74566 33.971C6.39282 39.6292 5.18183 45.6936 5.18182 51.818"
            stroke="#EBEBEB"
            strokeWidth="10.3636"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Progress Text */}
      <div className="absolute text-center">
        <p className="text-xl font-semibold text-gray-800">
          {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
};

export default SemiCircularProgressBar;
