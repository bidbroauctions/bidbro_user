"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";

const Carousel = ({ images }: { images: StaticImageData[] | string[] }) => {
  // State to track the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle navigation to the previous image
  const handlePrev = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // Handle navigation to the next image
  const handleNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const handleSpecificIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className=" space-y-6 w-full relative  ">
      {/* Image Display */}
      <div className="relative">
        <Image
          src={images[currentIndex]}
          alt={"auction image"}
          width={600}
          height={450}
          className=" w-full max-h-[600px] min-h-[450px] h-full rounded-2xl object-cover"
        />

        {/* Arrows */}
        <div>
          <div
            onClick={handlePrev}
            className="absolute cursor-pointer top-1/2 left-6  transform  -translate-y-1/2 bg-white p-2 flex items-center justify-center w-fit rounded-full shadow-lg"
          >
            <ChevronLeftIcon className="w-5 h-5 text-[#363435]" />
          </div>
          <div
            onClick={handleNext}
            className="absolute cursor-pointer top-1/2 right-6  transform  -translate-y-1/2 bg-white p-2 flex items-center justify-center w-fit rounded-full shadow-lg"
          >
            <ChevronRightIcon className="w-5 h-5 text-[#363435]" />
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="w-full flex items-center justify-center space-x-2">
        {images.map((_, index) => (
          <div
            onClick={() => handleSpecificIndex(index)}
            key={index}
            className={classNames(
              "w-4 h-4 rounded-full bg-[#EBEBEB] cursor-pointer",
              {
                "bg-[#F68B36]": index === currentIndex,
              }
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
