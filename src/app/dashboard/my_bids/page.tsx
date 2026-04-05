/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import StatusTiles from "./component/StatusTiles";
import CategoryTiles from "./component/CategoryTiles";
import MyBidTable, { BiddingTableData } from "./component/table/Table";
import PorsheImage from "@/assets/images/auction/porshe.jpeg"; // Example image placeholder
import { useUserStore } from "@/store/useUserStore";
import BidService from "@/app/api/BidService";
import toast from "react-hot-toast";
import { Bid, BidStatus, PaginationResponse } from "@/types";
import FilterSearch from "../component/FilterSearch";
import PaginationComponent from "../component/Pagination";
import PaginationArrow from "@/assets/icons/PaginationArrow";
import classNames from "classnames";

/* eslint-disable @next/next/no-img-element */

const headers = [
  { key: "name", label: "Name" },
  { key: "lotNumber", label: "Lot number" },
  { key: "category", label: "Category" },
  { key: "startingPrice", label: "Starting price" },
  { key: "bidAmount", label: "Bid amount" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

const statusColors: Record<BidStatus, string> = {
  [BidStatus.INITIATED]: "bg-[#E0F7FA] text-[#00796B]",
  [BidStatus.IN_PROGRESS]: "bg-[#FEF3EB] text-[#965521]",
  [BidStatus.AMOUNT_LOCKED]: "bg-[#FFFDE7] text-[#F57F17]",
  [BidStatus.SELECTED]: "bg-[#E8F5E9] text-[#388E3C]",
  [BidStatus.REFUND_INITIATED]: "bg-[#FFF3E0] text-[#F57C00]",
  [BidStatus.REFUND_COMPLETED]: "bg-[#E0F2F1] text-[#00796B]",
  [BidStatus.REJECTION_INITIATED]: "bg-[#FFEBEE] text-[#C62828]",
  [BidStatus.REJECTED]: "bg-[#FDEDEC] text-[#D32F2F]",
  [BidStatus.RELEASE_INITIATED]: "bg-[#E1F5FE] text-[#0288D1]",
  [BidStatus.WON]: "bg-[#D9F2EF] text-[#006557]",
  [BidStatus.LOST]: "bg-[#EB575726] text-[#EB5757]",
  [BidStatus.WITHDRAWN]: "bg-[#F1F5F9] text-[#1C2938]",
  [BidStatus.CANCELED]: "bg-[#FDEDEC] text-[#B71C1C]",
};

const Page = () => {
  const { company } = useUserStore();
  const isUser = !company?.id;
  const [bids, setBids] = useState<Bid[]>([]);
  const [response, setResponse] = useState<PaginationResponse<Bid>>({
    name: "",
    size: 1,
    limit: 1,
    page: 1,
    pageCount: 1,
    previousPage: null,
    nextPage: null,
    totalItems: 1,
    records: [],
  });
  const [tableData, setTableData] = useState<BiddingTableData[]>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [filter, setFilter] = useState("");

  const fetchData = useCallback(
    async ({
      limit,
      page,
    }: {
      limit?: number;
      page?: number;
      startsAfter?: string;
      endsAfter?: string;
      search?: string;
    }) => {
      BidService.FetchBidsService({
        sort: "createdAt:desc",
        page,
        limit,
      }).then((response) => {
        if (response.success) {
          setBids(response.data.records);
          setResponse(response.data);
          const formattedData = response.data.records.map((bid) => ({
            id: bid.id,
            name: `${bid.item.make} ${bid.item.model}`,
            lotNumber: bid.item.lotNumber,
            category: bid.item.category.name,
            startingPrice: bid.item.buyNowPrice
              ? `₦${bid.item.buyNowPrice.toLocaleString()}`
              : "Not Available",
            bidAmount: `₦${bid.bidAmount.toLocaleString()}`,
            status: bid.status.replace("_", " ").toLowerCase(),
            statusType: bid.status,
            images:
              bid.item.media.length > 0
                ? bid.item.media
                    .map((media) => media.url)
                    .filter((url) => url !== undefined)
                : [PorsheImage],
          }));
          setTableData(formattedData);
        } else {
          toast.error(response.message);
        }
      });
    },
    []
  );

  useEffect(() => {
    if (bids.length < 1) fetchData({ limit, page });
  }, [fetchData, bids, limit, page]);

  function handleLimit(limit: number) {
    setLimit(limit);
    fetchData({ limit, page });
  }

  function handleFilter(filter: string) {
    setFilter(filter);
  }

  function handlePageChange(page: number) {
    setPage(page);
    fetchData({ limit, page });
  }

  return isUser ? (
    <div className="space-y-6">
      <div className="flex w-full space-x-6">
        <div className="flex-[1_1_100%]">
          <StatusTiles />
        </div>
        <div className="flex-[1_1_100%]">
          <CategoryTiles />
        </div>
      </div>
      <div>
        <h1 className="w-full font-bold text-lg text-[#101828]">My Bids</h1>
      </div>

      <div
        className="w-full h-full rounded-xl space-y-6 bg-white"
        style={{
          boxShadow: "0px 1px 3px 0px #1018281A",
        }}
      >
        <FilterSearch handleLimit={handleLimit} handleFilter={handleFilter} />
        <MyBidTable
          headers={headers}
          data={tableData}
          statusColors={statusColors}
          renderImage={true}
        />
        <PaginationComponent
          data={response}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <div className="flex gap-4">
        <h1 className="w-full font-bold text-lg text-[#101828]">My Bids</h1>
      </div>
      <div className="space-y-2 rounded-lg p-2 bg-[#D9F2EF] text-[#262425] w-fit">
        <h1 className="text-base font-bold">Oh My!</h1>
        <p className=" text-sm font-medium">
          Company accounts are not eligible to bid. Interested in bidding for
          assets, kindly{" "}
          <Link href={"/auth/sign_up"} className="text-[#F68B36]">
            sign-up
          </Link>{" "}
          for a user account instead.
        </p>
      </div>
    </div>
  );
};

export default Page;
