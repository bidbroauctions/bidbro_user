import { ArrowsPointingOutIcon, PlayIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { extractVideoThumbnailFromUrl } from "@/app/helpers/media"; // Ensure this is an async function

const VideoComponent = ({ videos }: { videos: string[] }) => {
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const video = videos[0]; // Get the first video
  console.log({ video });

  useEffect(() => {
    if (video) {
      const getThumbnail = async () => {
        try {
          const thumbnail = await extractVideoThumbnailFromUrl(video);
          setVideoThumbnail(thumbnail);
        } catch (error) {
          console.error("Error generating thumbnail:", error);
          // Optionally set a fallback image or handle the error
        }
      };

      getThumbnail();
    }
  }, [video]);

  if (!video) {
    return null;
  }

  return (
    <div>
      <div
        className="my-2 p-4 border border-[#F9FAFB] bg-white space-y-6"
        style={{
          boxShadow: "0px 1px 3px 0px #1018281A",
        }}
      >
        <div className="flex w-full justify-between items-center text-[#363435]">
          <p className="font-medium text-lg">Video of functioning asset</p>
          <ArrowsPointingOutIcon className="w-5 h-5 " />
        </div>

        {/* Video Thumbnail */}
        <div className="relative w-full h-[200px]">
          {isPlaying ? (
            <video
              src={video}
              className="w-full h-full rounded-md"
              controls
              autoPlay
            />
          ) : (
            <div className="relative w-full h-full">
              {/* Check if videoThumbnail exists before rendering the Image */}
              {videoThumbnail ? (
                <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden z-10">
                  <Image
                    src={videoThumbnail} // Use thumbnail if available
                    alt="Video Thumbnail"
                    width={300}
                    height={200}
                    className="object-cover w-full h-full brightness-50"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden z-10">
                  <div className="w-full h-full bg-gray-300" />
                  {/* You can also use a placeholder image here */}
                </div>
              )}

              {/* Play Button */}
              <div
                className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 flex items-center justify-center w-fit rounded-full shadow-lg cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                <PlayIcon className="w-5 h-5 text-[#363435]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoComponent;
