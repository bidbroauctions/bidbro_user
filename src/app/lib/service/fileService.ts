import axiosInstance from "@/app/axios/axiosInit";
import { ApiErrorResponse, FileUploadResponse } from "@/types";
import { isAxiosError } from "axios";

export const UploadFile = async (payload: { file: File }) => {
  try {
    const { file } = payload;
    console.log("Sending API...");
    const data = { file };

    // Define the correct response type when the API call is successful
    const response = await axiosInstance.post<FileUploadResponse>(
      "/user/auth/otp/verify",
      data,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // Return the success response
    return {
      success: true,
      message: "Otp verified",
      data: response.data,
    };
  } catch (error) {
    // Handle Axios errors
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      console.error("Error initiating OTP:", errorResponse.message);

      // Return the error response
      return {
        success: false,
        message: errorResponse.message,
        data: errorResponse.data,
      };
    }

    // Handle non-Axios errors (network issues, etc.)
    console.error("An unknown error occurred:", error);
    return {
      success: false,
      message: "An unknown error occurred",
      data: {},
    };
  }
};
