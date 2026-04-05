import axiosInstance from "@/app/axios/axiosInit";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  PaginationResponse,
  Bid,
} from "@/types";
import { isAxiosError } from "axios";
import { MyBidResponse } from "../mock/my_bids";

// Fetch all bids with sorting and pagination
const FetchBidsService = async ({
  sort = "createdAt:desc",
  page = 1,
  limit = 10,
}: {
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<ApiSuccessResponse<PaginationResponse<Bid>>> => {
  try {
    const isMocked = true;
    const response = isMocked
      ? { data: MyBidResponse }
      : await axiosInstance.get<PaginationResponse<Bid>>("/auction/bids", {
          params: {
            sort,
            page,
            limit,
          },
          headers: {
            Accept: "application/json",
          },
        });

    return {
      success: true,
      message: "Bids fetched successfully",
      data: response.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      return {
        success: false,
        message: errorResponse.message,
        data: {
          name: "",
          size: 0,
          totalItems: 0,
          nextPage: null,
          previousPage: null,
          pageCount: 0,
          page: 1,
          limit: 1,
          records: [],
        },
      };
    }

    return {
      success: false,
      message: "An unknown error occurred",
      data: {
        name: "",
        size: 0,
        totalItems: 0,
        nextPage: null,
        previousPage: null,
        pageCount: 0,
        page: 1,
        limit: 1,
        records: [],
      },
    };
  }
};

// Fetch a single bid by its ID
const FetchSingleBidService = async (
  bidId: string
): Promise<ApiSuccessResponse<Bid>> => {
  try {
    const isMocked = true;
    // Make the request to fetch the bid by ID
    const response = isMocked
      ? { data: MyBidResponse.records[0] }
      : await axiosInstance.get<Bid>(`/auction/bids/${bidId}`, {
          headers: {
            Accept: "application/json",
          },
        });

    // Return the success response with bid data
    return {
      success: true,
      message: "Bid fetched successfully",
      data: response.data,
    };
  } catch (error) {
    // Handle errors from Axios requests
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      return {
        success: false,
        message: errorResponse.message,
        data: {} as Bid,
      };
    }

    // Handle unknown errors
    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as Bid,
    };
  }
};

// Export BidService
const BidService = {
  FetchBidsService,
  FetchSingleBidService,
};

export default BidService;
