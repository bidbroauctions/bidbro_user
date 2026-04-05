import axiosInstance from "@/app/axios/axiosInit";
import axios, { AxiosProgressEvent } from "axios";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  FileUploadResponse,
} from "@/types";
import { isAxiosError } from "axios";

// Create the file service and get the presigned URL
const CreateFileService = async ({
  type,
  fileName,
  contentType,
  description,
  isPrivate,
  updateIfExists = false,
}: {
  type: string;
  fileName: string;
  updateIfExists: boolean;
  contentType?: string;
  description?: string;
  isPrivate?: boolean;
}): Promise<ApiSuccessResponse<FileUploadResponse>> => {
  try {
    const data = {
      type,
      fileName,
      contentType,
      description,
      isPrivate,
      updateIfExists,
    };

    const response = await axiosInstance.post<FileUploadResponse>(
      "/file/me/files",
      data,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: "File service created successfully",
      data: response.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      return {
        success: false,
        message: errorResponse.message,
        data: errorResponse.data as FileUploadResponse,
      };
    }

    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as FileUploadResponse,
    };
  }
};

// Service to upload a file using the presigned URL with progress tracking
const UploadFileToS3 = async (
  presignedUrl: string,
  file: File,
  contentType: string,
  onProgress?: (progressEvent: AxiosProgressEvent) => void // Add this for progress tracking
): Promise<boolean> => {
  try {
    // Upload file directly to S3 with progress tracking
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": contentType,
      },
      onUploadProgress: onProgress, // Pass the progress event to track the progress
    });
    return true;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return false;
  }
};

// Get metadata of the file
interface FileMetadataResponse {
  fileName: string;
  extension: string;
  mimeType: string;
  contentType: string;
  size: number;
  lastModified: number;
}

const GetFileMetadataService = async (
  file: File
): Promise<FileMetadataResponse> => {
  const fileName = file.name;
  const extension = fileName.split(".").pop()?.toLowerCase() || "unknown"; // Get the file extension or default to 'unknown'

  return {
    fileName,
    extension,
    mimeType: file.type || "application/octet-stream", // Fallback to binary stream if type is not recognized
    contentType: file.type || "application/octet-stream", // Content type is same as MIME type for File objects
    size: file.size, // Size in bytes
    lastModified: file.lastModified, // Last modified time in Unix epoch time
  };
};

const UploadFileService = async (
  file: File,
  options: {
    fileName: string;
    type: "PROFILE" | "ITEM" | "OTHER";
    updateIfExists?: boolean;
    description?: string;
  },
  onProgress?: (progressEvent: AxiosProgressEvent) => void // Add this parameter for progress tracking
): Promise<ApiSuccessResponse<FileUploadResponse>> => {
  try {
    const { fileName, type, description, updateIfExists = false } = options;

    // Get file metadata
    const fileMetadata = await GetFileMetadataService(file);
    console.log("File metadata:", fileMetadata);
    const file_name = `${fileName}.${fileMetadata.extension}`;
    console.log("File name:", file_name);
    // Create the file in your backend service, which returns a presigned URL
    const createFileResponse = await CreateFileService({
      type,
      fileName: file_name,
      contentType: fileMetadata.contentType,
      description: description || "File upload",
      isPrivate: false,
      updateIfExists,
    });

    if (!createFileResponse.success || !createFileResponse.data.presignedUrl) {
      console.error(
        "Failed to create file service:",
        createFileResponse.message
      );
      return {
        success: false,
        message: "Failed to create file service",
        data: {} as FileUploadResponse,
      };
    }

    // Upload the file to S3 using the presigned URL and track progress
    const uploadSuccess = await UploadFileToS3(
      createFileResponse.data.presignedUrl,
      file,
      fileMetadata.contentType,
      onProgress // Pass the progress callback
    );

    if (!uploadSuccess) {
      console.error("Failed to upload file to S3");
      return {
        success: false,
        message: "Failed to upload file to S3",
        data: {} as FileUploadResponse,
      };
    }

    console.log(
      "File uploaded successfully to S3:",
      createFileResponse.data.url
    );

    return {
      success: true,
      message: "File uploaded successfully",
      data: createFileResponse.data,
    };
  } catch (error) {
    console.error("An error occurred during the file upload process:", error);
    return {
      success: false,
      message: "An error occurred during the file upload process",
      data: {} as FileUploadResponse,
    };
  }
};

const FileService = {
  CreateFileService,
  GetFileMetadataService,
  UploadFileService,
  UploadFileToS3,
};

export default FileService;
