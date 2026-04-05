import { Bid, PaginationResponse } from "@/types";
import { bids } from "./auction";

export const MyBidResponse: PaginationResponse<Bid> = {
  name: "string",
  size: 1,
  totalItems: 0,
  nextPage: 0,
  previousPage: 0,
  pageCount: 1,
  page: 1,
  limit: 1,
  records: bids,
};
