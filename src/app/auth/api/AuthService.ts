import axiosInstance from "@/app/axios/axiosInit";
import { getHostUrl } from "@/app/lib/location";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  USER_TYPE,
  VerifyOtpResponse,
} from "@/types";
import { isAxiosError } from "axios";

// Adjusted sendOtp function using the ApiSuccessResponse and ApiErrorResponse types
export const sendOtp = async (payload: {
  email: string;
  accountType?: USER_TYPE;
  authType: "SIGNUP" | "LOGIN";
}): Promise<ApiSuccessResponse<unknown>> => {
  const { email, accountType, authType } = payload;
  try {
    console.log("Sending API...");
    const data = {
      email,
      accessType: accountType,
      authType,
    } as {
      email: string;
      accessType: USER_TYPE;
      authType?: "SIGNUP" | "LOGIN";
    };

    if (accountType) data.accessType = accountType;

    // Define the correct response type when the API call is successful
    const response = await axiosInstance.post<ApiSuccessResponse<unknown>>(
      "/user/auth/otp/initiate",
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
      message: response.data.message,
      data: response.data.data,
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
export const initialSocialAuth = async (
  provider = "google",
  page: "login" | "sign_up"
): Promise<ApiSuccessResponse<{ initializationUrl: string }>> => {
  try {
    const data = {
      redirectUrl: `${await getHostUrl()}/auth/${page || "sign_up"}`,
    };
    // Define the correct response type when the API call is successful
    const response = await axiosInstance.post<{
      initializationUrl: string;
    }>(`/user/auth/${provider}/initiate`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Return the success response
    return {
      success: true,
      message: "Social auth initiated",
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
        data: {
          initializationUrl: "",
        },
      };
    }

    // Handle non-Axios errors (network issues, etc.)
    console.error("An unknown error occurred:", error);
    return {
      success: false,
      message: "An unknown error occurred",
      data: {
        initializationUrl: "",
      },
    };
  }
};

export const initiateOTP = async (
  purpose: "EMAIL_VERIFICATION" | "BANK_ACCOUNT_CREATION"
): Promise<ApiSuccessResponse<unknown>> => {
  try {
    const data = {
      purpose,
    };
    // Define the correct response type when the API call is successful
    await axiosInstance.post<{
      success: boolean;
    }>(`/user/me/otp`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Return the success response
    return {
      success: true,
      message: "OTP initiated",
      data: {},
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
        data: {
          initializationUrl: "",
        },
      };
    }

    // Handle non-Axios errors (network issues, etc.)
    console.error("An unknown error occurred:", error);
    return {
      success: false,
      message: "An unknown error occurred",
      data: {
        initializationUrl: "",
      },
    };
  }
};

export const VerifySocialAuth = async (payload: {
  idToken: string;
  provider: string;
  authType?: "SIGNUP" | "LOGIN";
}): Promise<ApiSuccessResponse<VerifyOtpResponse>> => {
  const { idToken, provider, authType } = payload;
  try {
    console.log("Sending API...");
    const data = {
      idToken,
      authType,
      provider,
    } as {
      idToken: string;
      authType?: "SIGNUP" | "LOGIN";
      provider: string;
    };
    // Define the correct response type when the API call is successful
    const response = await axiosInstance.post<VerifyOtpResponse>(
      "/user/auth/social/verify",
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
      message: "Social auth verified",
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
        data: errorResponse.data as VerifyOtpResponse,
      };
    }

    // Handle non-Axios errors (network issues, etc.)
    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as VerifyOtpResponse,
    };
  }
};

export const VerifyOtp = async (payload: {
  email: string;
  otp: string;
  accountType?: USER_TYPE;
  authType: "SIGNUP" | "LOGIN";
}): Promise<ApiSuccessResponse<VerifyOtpResponse>> => {
  const { email, otp, accountType, authType } = payload;
  try {
    console.log("Sending API...");
    const data = {
      email,
      otp,
      authType,
    } as {
      email: string;
      accessType: USER_TYPE;
      authType?: "SIGNUP" | "LOGIN";
      otp: string;
    };

    if (accountType) data.accessType = accountType;
    // Define the correct response type when the API call is successful
    const response = await axiosInstance.post<VerifyOtpResponse>(
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
        data: errorResponse.data as VerifyOtpResponse,
      };
    }

    // Handle non-Axios errors (network issues, etc.)
    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as VerifyOtpResponse,
    };
  }
};

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  address: {
    placeId: string;
    fullAddress: string;
    state: string;
    country: string;
    coordinates: {
      lng: number;
      lat: number;
    };
  };
  gender: string;
  imageUrl: string;
  phone: string;
  dob: string;
  // email?L
}

// Function to update user profile
export const updateUserProfile = async (
  payload: UpdateUserPayload
): Promise<ApiSuccessResponse<VerifyOtpResponse>> => {
  try {
    console.log("Sending API to update user profile...");

    // Make the PATCH request to update the user profile
    const response = await axiosInstance.patch<VerifyOtpResponse>(
      "/user/me",
      payload,
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
      message: "User profile updated successfully",
      data: response.data,
    };
  } catch (error) {
    // Handle Axios errors
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      console.error("Error updating user profile:", errorResponse.message);

      // Return the error response
      return {
        success: false,
        message: errorResponse.message,
        data: {} as VerifyOtpResponse,
      };
    }

    // Handle non-Axios errors (network issues, etc.)
    console.error("An unknown error occurred:", error);
    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as VerifyOtpResponse,
    };
  }
};
// Service to fetch the current user's account details
export const getMyAccount = async (): Promise<
  ApiSuccessResponse<VerifyOtpResponse>
> => {
  try {
    // Define the correct response type when the API call is successful
    const response = await axiosInstance.get<VerifyOtpResponse>("/user/me", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Return the success response
    return {
      success: true,
      message: "Account details fetched successfully",
      data: response.data,
    };
  } catch (error) {
    // Handle Axios errors
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      console.error("Error fetching account details:", errorResponse.message);

      // Return the error response
      return {
        success: false,
        message: errorResponse.message,
        data: {} as VerifyOtpResponse,
      };
    }

    // Handle non-Axios errors (network issues, etc.)
    console.error("An unknown error occurred:", error);
    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as VerifyOtpResponse,
    };
  }
};
export const logOut = async (): Promise<ApiSuccessResponse<unknown>> => {
  try {
    // Make the PATCH request to update the user profile
    const response = await axiosInstance.patch<VerifyOtpResponse>(
      "/user/auth/logout",

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
      message: "User logout successfully",
      data: response.data,
    };
  } catch (error) {
    // Handle Axios errors
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      console.error("Error updating user profile:", errorResponse.message);

      // Return the error response
      return {
        success: false,
        message: errorResponse.message,
        data: {} as VerifyOtpResponse,
      };
    }

    // Handle non-Axios errors (network issues, etc.)
    console.error("An unknown error occurred:", error);
    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as VerifyOtpResponse,
    };
  }
};

// Function to refresh tokens
export const refreshTokenService = async (
  refreshToken: string
): Promise<ApiSuccessResponse<VerifyOtpResponse>> => {
  try {
    // Make the PUT request to refresh tokens
    const response = await axiosInstance.put<VerifyOtpResponse>(
      "/user/auth/refresh-token",
      {},
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    // Return the success response
    return {
      success: true,
      message: "Tokens refreshed successfully",
      data: response.data,
    };
  } catch (error) {
    // Handle Axios errors
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      console.error("Error refreshing token:", errorResponse.message);

      // Return the error response
      return {
        success: false,
        message: errorResponse.message,
        data: {} as VerifyOtpResponse,
      };
    }

    // Handle non-Axios errors (network issues, etc.)
    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as VerifyOtpResponse,
    };
  }
};
