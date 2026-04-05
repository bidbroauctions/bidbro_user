/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";

import BxTrash from "@/assets/icons/Secondary/Outline/bx-trash";
import { PlayIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { extractVideoThumbnail } from "@/app/helpers/media";

interface ImagePickerProps {
  onFileSelect?: (file: File | null) => void;
  parentClassName?: string;
  acceptedFileTypes: string[];
  uploadProgress?: number; // Add uploadProgress prop
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  onFileSelect,
  parentClassName,
  acceptedFileTypes,
  uploadProgress = -1,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isPDF, setIsPDF] = useState<boolean>(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Handle file drop
  const onDrop = async (acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0]; // Get the first accepted file
    if (file) {
      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        setIsVideo(false);
        setIsPDF(false);
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        setIsVideo(true);
        setIsPDF(false);

        // Use the helper function to extract the thumbnail
        try {
          const thumbnail = await extractVideoThumbnail(file);
          setPreviewUrl(thumbnail);
        } catch (error) {
          console.error("Error extracting video thumbnail", error);
        }
      } else if (file.type === "application/pdf") {
        setIsPDF(true);
        setIsVideo(false);
        setPreviewUrl("/icons/pdf-icon.png");
      }

      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  // Configure Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    multiple: false,
  });

  // Handle Delete
  const handleDelete = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setVideoPlaying(false);
    setIsPDF(false);
  };

  return (
    <div className={classNames(`cursor-pointer ${parentClassName}`)}>
      <div
        className={`relative border-2 border-dashed rounded-md text-center max-w-[300px] max-h-[200px] w-full h-full items-center text-[12px] ${
          isDragActive ? "border-blue-500" : "border-gray-400"
        }`}
      >
        {selectedFile && previewUrl ? (
          <div className="w-full h-full relative group">
            {isVideo ? (
              !videoPlaying ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Video Thumbnail"
                    className="w-full h-full rounded-md group-hover:brightness-50"
                  />
                  {uploadProgress < 0 && (
                    <div
                      className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 flex items-center justify-center w-fit rounded-full shadow-lg"
                      onClick={() => setVideoPlaying(true)}
                    >
                      <PlayIcon className="w-5 h-5 text-[#363435]" />
                    </div>
                  )}
                </>
              ) : (
                <video
                  src={URL.createObjectURL(selectedFile)}
                  className="w-full h-full rounded-md"
                  controls
                  autoPlay
                />
              )
            ) : isPDF ? (
              <>
                <img
                  src={previewUrl || "/icons/pdf-icon.png"}
                  alt="PDF Preview"
                  className="w-full h-full rounded-md"
                />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-xs bg-black p-1 px-2 rounded">
                  {selectedFile.name}
                </div>
              </>
            ) : (
              <img
                src={previewUrl}
                alt="Selected"
                className="w-full h-full rounded-md group-hover:brightness-50"
              />
            )}

            {/* Delete button */}
            {uploadProgress < 0 && (
              <div
                className="bg-white text-[#EB5757] z-10 text-sm px-2 py-1 space-x-1 rounded-2xl hidden group-hover:flex absolute items-center left-1/2 -translate-x-1/2 bottom-4"
                onClick={handleDelete}
              >
                <BxTrash />
                <span>Delete</span>
              </div>
            )}

            {/* Upload progress bar */}
            {uploadProgress > -1 && (
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center flex-col space-y-4">
                <div className="w-3/4 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="text-white ml-4">{uploadProgress}%</span>
              </div>
            )}
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="dropzone p-6 flex items-center h-full"
          >
            <input {...getInputProps()} size={20 * 1024 * 1024} />
            {isDragActive ? (
              <p className="text-blue-500">Drop the file here...</p>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="font-semibold text-black">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500">
                  Supported file formats:{" "}
                  {acceptedFileTypes
                    .map((types) =>
                      types === "image/*"
                        ? "image"
                        : types === "application/pdf"
                        ? "PDF"
                        : types
                    )
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePicker;
