import axiosInstance from "@/app/axios/axiosInit";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  PaginationResponse,
  Category,
} from "@/types";
import { isAxiosError } from "axios";

// Fetch all categories with sorting
const FetchCategoriesService = async ({
  sort = "createdAt:desc",
  page = 1,
  limit = 10,
}: {
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<ApiSuccessResponse<PaginationResponse<Category>>> => {
  try {
    const response = await axiosInstance.get<PaginationResponse<Category>>(
      "/auction/categories",
      {
        params: {
          sort,
          page,
          limit,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Categories fetched successfully",
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

// Export CategoryService
const CategoryService = {
  FetchCategoriesService,
};

export default CategoryService;
