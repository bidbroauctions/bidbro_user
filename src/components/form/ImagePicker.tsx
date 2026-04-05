/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import React, { useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";

interface ImagePickerProps {
  onFileSelect?: (file: File | null) => void; // Optional callback for parent component
  parentClassName?: string;
  replaceInputWithPreview?: boolean; // New prop to conditionally replace input with preview
  acceptedFileTypes?: string[]; // New prop for accepted file types
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  onFileSelect,
  parentClassName,
  replaceInputWithPreview = true, // Default is true (replace input with preview)
  acceptedFileTypes = ["image/png", "image/jpeg"], // Default to images
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle file drop
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0]; // Get the first accepted file
    if (file) {
      setSelectedFile(file);

      // Handle image preview for image files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string); // Set the image preview URL
        };
        reader.readAsDataURL(file); // Read the file as a data URL
      } else {
        setPreviewUrl(null); // No preview for non-image files
      }

      if (onFileSelect) {
        onFileSelect(file); // Notify parent component of the selected file
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

  return (
    <div className={classNames(`cursor-pointer ${parentClassName}`)}>
      {/* Conditionally render the input or preview based on replaceInputWithPreview */}
      {selectedFile && replaceInputWithPreview && previewUrl ? (
        // Show the image preview if it's an image and replaceInputWithPreview is true
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Selected"
            className="max-w-xs h-[200px] w-[200px] border border-gray-300 rounded-md"
          />
        </div>
      ) : selectedFile && replaceInputWithPreview && !previewUrl ? (
        // Show file name if the selected file is not an image (e.g., PDF)
        <div className="mt-4">
          <p>{selectedFile.name}</p>
        </div>
      ) : (
        // Render the input box with the dropzone
        <div
          {...getRootProps()}
          className={`dropzone border-2 border-dashed rounded-md p-6 text-center h-full items-center text-[12px] ${
            isDragActive ? "border-blue-500" : "border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the file here...</p>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <p className="font-semibold text-black">
                Click to upload or drag and drop
              </p>
              <p className="text-gray-500">
                Supported file formats: {acceptedFileTypes.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Optionally, if replaceInputWithPreview is false, show both input and preview */}
      {selectedFile && !replaceInputWithPreview && (
        <div className="mt-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected"
              className="max-w-xs h-[200px] w-[200px border border-gray-300 rounded-md"
            />
          ) : (
            <p>{selectedFile.name}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
