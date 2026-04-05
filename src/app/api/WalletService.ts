import axiosInstance from "@/app/axios/axiosInit";
import {
  AddBankAccountResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
  BankAccountResolveResponse,
  BankAccountsResponse,
  BankRecordsResponse,
  TransactionsResponse,
  WalletsResponse,
} from "@/types";
import { isAxiosError } from "axios";
import { transactionsResponse } from "../mock/transactions";

// Fetch bank service
const FetchBankService = async (): Promise<
  ApiSuccessResponse<BankRecordsResponse>
> => {
  try {
    const response = await axiosInstance.get<BankRecordsResponse>(
      "/wallet/banks",
      {
        params: {
          provider: "PAYSTACK",
          currency: "NGN",
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Banks fetched successfully",
      data: response.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      return {
        success: false,
        message: errorResponse.message,
        data: {
          records: [],
        },
      };
    }

    return {
      success: false,
      message: "An unknown error occurred",
      data: {
        records: [],
      },
    };
  }
};

// Service to resolve bank account details
const ResolveBankAccountService = async ({
  bankCode,
  accountNumber,
  provider = "PAYSTACK",
}: {
  bankCode: string;
  accountNumber: string;
  provider?: string;
}): Promise<ApiSuccessResponse<BankAccountResolveResponse>> => {
  try {
    const data = {
      bankCode,
      accountNumber,
      provider,
    };

    const response = await axiosInstance.post<BankAccountResolveResponse>(
      "/wallet/banks/accounts/resolve",
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
      message: "Bank account resolved successfully",
      data: response.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      return {
        success: false,
        message: errorResponse.message,
        data: {} as BankAccountResolveResponse,
      };
    }

    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as BankAccountResolveResponse,
    };
  }
};

// Service to add bank account
const AddBankAccountService = async ({
  otp,
  bankCode,
  provider = "PAYSTACK",
  currency = "NGN",
  bankName,
  bankLogoUrl,
  accountNumber,
  accountName,
}: {
  otp: string;
  bankCode: string;
  bankLogoUrl?: string;
  provider?: string;
  currency?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}): Promise<ApiSuccessResponse<AddBankAccountResponse>> => {
  try {
    const data = {
      otp,
      bankCode,
      provider,
      currency,
      bankName,
      bankLogoUrl,
      accountNumber,
      accountName,
    };

    const response = await axiosInstance.post<AddBankAccountResponse>(
      "/wallet/banks/accounts",
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
      message: "Bank account added successfully",
      data: response.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      return {
        success: false,
        message: errorResponse.message,
        data: {} as AddBankAccountResponse,
      };
    }

    return {
      success: false,
      message: "An unknown error occurred",
      data: {} as AddBankAccountResponse,
    };
  }
};
// Service to fetch all bank accounts
const FetchAllAccountsService = async ({
  sort = "createdAt:desc",
  provider = "PAYSTACK",
  currency = "NGN",
  page = 1,
  limit = 10,
}: {
  sort?: string;

  provider?: string;
  currency?: string;
  page?: number;
  limit?: number;
}): Promise<ApiSuccessResponse<BankAccountsResponse>> => {
  try {
    const response = await axiosInstance.get<BankAccountsResponse>(
      "/wallet/banks/accounts",
      {
        params: {
          sort,
          provider,
          currency,
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
      message: "Bank accounts fetched successfully",
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
// Service to fetch user's wallets
const FetchWalletBalance = async (): Promise<
  ApiSuccessResponse<WalletsResponse>
> => {
  try {
    const response = await axiosInstance.get<WalletsResponse>(
      "/wallet/me/wallets",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Wallets fetched successfully",
      data: response.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorResponse = error.response.data as ApiErrorResponse;
      return {
        success: false,
        message: errorResponse.message,
        data: {
          records: [],
        },
      };
    }

    return {
      success: false,
      message: "An unknown error occurred",
      data: {
        records: [],
      },
    };
  }
};
const FetchAllTransactionsService = async ({
  page = 1,
  limit = 10,
  sort = "createdAt:desc",
  type,
  status,
  provider,
  currency = "NGN",
  afterDate,
  beforeDate,
}: {
  page?: number;
  limit?: number;
  sort?: string;
  type?: string;
  status?: string;
  provider?: string;
  currency?: string;
  afterDate?: string;
  beforeDate?: string;
}): Promise<ApiSuccessResponse<TransactionsResponse>> => {
  try {
    const isMocked = true;
    const response = isMocked
      ? { data: transactionsResponse }
      : await axiosInstance.get<TransactionsResponse>(
          "/wallet/me/transactions",
          {
            params: {
              page,
              limit,
              sort,
              type,
              status,
              provider,
              currency,
              afterDate,
              beforeDate,
            },
            headers: {
              Accept: "application/json",
            },
          }
        );

    return {
      success: true,
      message: "Transactions fetched successfully",
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

const WalletService = {
  FetchBankService,
  ResolveBankAccountService,
  AddBankAccountService,
  FetchAllAccountsService,
  FetchWalletBalance,
  FetchAllTransactionsService,
};

export default WalletService;
