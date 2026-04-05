import axiosInstance from "@/app/axios/axiosInit";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  CompanyUpdateRequest,
  CompanyUpdateResponse,
} from "@/types";
import { isAxiosError } from "axios";

// Service to update company details
const UpdateCompanyService = async (
  data: CompanyUpdateRequest
): Promise<ApiSuccessResponse<CompanyUpdateResponse>> => {
  try {
    const response = await axiosInstance.patch<CompanyUpdateResponse>(
      "/user/me/company",
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
      message: "Company details updated successfully",
      data: response.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      return {
        success: false,
        message: errorResponse.message,
        data: {} as CompanyUpdateResponse,
      };
    }

    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as CompanyUpdateResponse,
    };
  }
};

// Export the service
const CompanyService = {
  UpdateCompanyService,
};

export default CompanyService;
