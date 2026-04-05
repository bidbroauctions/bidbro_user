import axiosInstance from "@/app/axios/axiosInit";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  Auction,
  FileUploadResponse,
  PaginationResponse,
} from "@/types";
import { isAxiosError } from "axios";

// Create Auction Item Service
const CreateAuctionItemService = async ({
  categoryId,
  make,
  model,
  description,
  yearOfManufacture,
  yearOfPurchase,
  purchaseStatus,
  functional,
  currency,
  reservedPrice,
  buyNowPrice,
  bidStartDate,
  bidEndDate,
  displayStartAmount,
  location,
  media,
}: {
  categoryId: string;
  make: string;
  model: string;
  description: string;
  yearOfManufacture: string;
  yearOfPurchase: string;
  purchaseStatus: string;
  functional: string;
  currency: string;
  reservedPrice: number;
  buyNowPrice?: number;
  bidStartDate: string;
  bidEndDate: string;
  displayStartAmount: boolean;
  location: {
    placeId: string;
    fullAddress: string;
    state: string;
    country: string;
    coordinates: {
      lng: number;
      lat: number;
    };
  };
  media: FileUploadResponse[];
}): Promise<ApiSuccessResponse<Auction>> => {
  try {
    const response = await axiosInstance.post<Auction>("/auction/items", {
      categoryId,
      make,
      model,
      description,
      yearOfManufacture,
      yearOfPurchase,
      purchaseStatus,
      functional,
      currency,
      reservedPrice,
      buyNowPrice,
      bidStartDate,
      bidEndDate,
      displayStartAmount,
      location,
      media,
    });

    return {
      success: true,
      message: "Auction item created successfully",
      data: response.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      return {
        success: false,
        message: errorResponse.message,
        data: {} as Auction, // Return an empty auction object on error
      };
    }

    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as Auction, // Return an empty auction object on unknown error
    };
  }
};

// Existing Fetch auction items service
const FetchAuctionItemsService = async ({
  sort = "createdAt:desc",
  page = 1,
  limit = 10,
  search,
  belongsTo = "ME",
  categoryId,
  startsAfter,
  endsAfter,
}: {
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
  belongsTo?: "ME" | "OTHERS";
  categoryId?: string;
  startsAfter?: string;
  endsAfter?: string;
}): Promise<ApiSuccessResponse<PaginationResponse<Auction>>> => {
  try {
    const response = await axiosInstance.get<PaginationResponse<Auction>>(
      "/auction/items",
      {
        params: {
          sort,
          page,
          limit,
          search,
          belongsTo,
          categoryId,
          startsAfter,
          endsAfter,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Auction items fetched successfully",
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

// Fetch single auction item service
const FetchSingleAuctionService = async (
  auctionId: string
): Promise<ApiSuccessResponse<Auction>> => {
  try {
    const response = await axiosInstance.get<Auction>(
      `/auction/items/${auctionId}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Auction item fetched successfully",
      data: response.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      return {
        success: false,
        message: errorResponse.message,
        data: {} as Auction, // Return an empty auction object on error
      };
    }

    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as Auction, // Return an empty auction object on unknown error
    };
  }
};

// Update Auction Item Service
const UpdateAuctionItemService = async (
  itemId: string,
  updateData: Partial<{
    categoryId: string;
    make: string;
    model: string;
    description: string;
    yearOfManufacture: string;
    yearOfPurchase: string;
    purchaseStatus: string;
    functional: string;
    reservedPrice: number;
    buyNowPrice?: number;
    bidStartDate: string;
    bidEndDate: string;
    displayStartAmount: boolean;
    location: {
      placeId: string;
      fullAddress: string;
      state: string;
      country: string;
      coordinates: {
        lng: number;
        lat: number;
      };
    };
    media: FileUploadResponse[];
  }>
): Promise<ApiSuccessResponse<Auction>> => {
  try {
    const response = await axiosInstance.patch<Auction>(
      `/auction/items/${itemId}`,
      updateData,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Auction item updated successfully",
      data: response.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      return {
        success: false,
        message: errorResponse.message,
        data: {} as Auction, // Return an empty auction object on error
      };
    }

    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as Auction, // Return an empty auction object on unknown error
    };
  }
};

// Export the AuctionService with Create, Fetch, and Fetch Single functionalities
const AuctionService = {
  CreateAuctionItemService,
  FetchAuctionItemsService,
  FetchSingleAuctionService,
  UpdateAuctionItemService,
};
export default AuctionService;
