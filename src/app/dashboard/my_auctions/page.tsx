/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import StatusTiles from "./component/StatusTiles";
import CategoryTiles from "./component/CategoryTiles";
import AuctionTable, { AuctionTableData } from "./component/table/Table";

import PorsheImage from "@/assets/images/auction/porshe.jpeg"; // Example image placeholder
import { useUserStore } from "@/store/useUserStore";
import { StaticImageData } from "next/image";
import BidService from "@/app/api/BidService";
import toast from "react-hot-toast";
import {
  Auction,
  AuctionStatus,
  Bid,
  BidStatus,
  FileUploadResponse,
  PaginationResponse,
} from "@/types";
import AuctionService from "@/app/api/AuctionService";
import { useRouter } from "next/navigation";
import Button from "../component/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import FilterSearch from "../component/FilterSearch";
import { fetchMediaImages } from "@/app/helpers/helpers";
import PaginationArrow from "@/assets/icons/PaginationArrow";
import classNames from "classnames";
import PaginationComponent from "../component/Pagination";

/* eslint-disable @next/next/no-img-element */
// reservedPrice: string;
// buyNowPrice: string;
// hammerPrice: string;

const headers = [
  { key: "name", label: "Name" },
  { key: "lotNumber", label: "Lot number" },
  { key: "category", label: "Category" },
  { key: "reservedPrice", label: "Reserved Price" },
  { key: "buyNowPrice", label: "Buy Now Price" },
  { key: "hammerPrice", label: "Hammer Price" },

  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

const statusColors: Record<AuctionStatus, string> = {
  [AuctionStatus.SCHEDULED]: "bg-[#E3FCEF] text-[#277745]",
  [AuctionStatus.IN_PROGRESS]: "bg-[#FEF3EB] text-[#965521]",
  [AuctionStatus.CONCLUDED]: "bg-[#D9F2EF] text-[#006557]",
  [AuctionStatus.REJECTED]: "bg-[#FBE9E9] text-[#D32F2F]",
  [AuctionStatus.ACTIONED]: "bg-[#F0F4F8] text-[#1C2938]",
  [AuctionStatus.WITHDRAWN]: "bg-[#F1F5F9] text-[#1C2938]",
  [AuctionStatus.CANCELED]: "bg-[#FCE4E4] text-[#B22222]",
};
const Page = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [response, setResponse] = useState<PaginationResponse<Auction>>({
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
  const [tableData, setTableData] = useState<AuctionTableData[]>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [filter, setFilter] = useState("");
  const fetchData = useCallback(
    async ({
      limit,
      page,
      startsAfter,
      endsAfter,
      search,
    }: {
      limit?: number;
      page?: number;
      startsAfter?: string;
      endsAfter?: string;
      search?: string;
    }) => {
      AuctionService.FetchAuctionItemsService({
        sort: "createdAt:desc",
        page,
        limit,
        startsAfter,
        endsAfter,
        search,
      }).then((response) => {
        if (response.success) {
          setAuctions(response.data.records);
          setResponse(response.data);
          const formattedData = response.data.records.map((auction) => {
            const reservedPrice = auction.reservedPrice
              ? `₦${auction?.reservedPrice?.toLocaleString()}`
              : "Not Available";
            const buyNowPrice = auction.buyNowPrice
              ? `₦${auction?.buyNowPrice?.toLocaleString()}`
              : "Not Available";
            const hammerPrice = auction.startAmount
              ? `₦${auction?.startAmount?.toLocaleString()}`
              : "Not Available";

            return {
              id: auction.id,
              name: `${auction.make} ${auction.model}`,
              lotNumber: auction.lotNumber,
              category: auction.category.name,
              reservedPrice,
              buyNowPrice,
              hammerPrice,
              status: auction.status.replace("_", " ").toLowerCase(),
              statusType: auction.status,
              images: fetchMediaImages(auction.media),
            } as AuctionTableData;
          });

          setTableData(formattedData);
        } else {
          toast.error(response.message);
        }
      });
    },
    []
  );
  // Fetch bids and update the table data
  useEffect(() => {
    if (auctions.length < 1) fetchData({ limit, page });
  }, [fetchData, auctions, limit, page]);
  const router = useRouter();
  function pushToAddItem() {
    router.push("/dashboard/my_auctions/add_auction");
  }
  function handleLimit(limit: number) {
    setLimit(limit);
    fetchData({ limit, page });
  }
  function handleSearch(search: string) {
    setSearch(search);
    fetchData({ search });
  }
  function handleDate(date: Date) {
    // The date is per month, so we need to get the start and end of the month
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    setDate(date);
    fetchData({
      limit,
      page,
      startsAfter: start.toISOString(),
      endsAfter: end.toISOString(),
    });
  }
  function handleFilter(filter: string) {}
  function handlePageChange(page: number) {
    setPage(page);
    fetchData({ limit, page });
  }
  return (
    <div className="space-y-6">
      <div className="flex w-full space-x-6">
        <div className="flex-[1_1_100%]">
          <StatusTiles />
        </div>
        <div className="flex-[1_1_100%]">
          <CategoryTiles />
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <h1 className="w-full font-bold text-lg text-[#101828]">My Auctions</h1>
        <Button className="w-fit flex-shrink-0" onClick={pushToAddItem}>
          <PlusIcon className="w-6 h-6" />
          <p>Add an Item</p>
        </Button>
      </div>

      <div
        className="w-full h-full rounded-xl space-y-6 bg-white"
        style={{
          boxShadow: "0px 1px 3px 0px #1018281A",
        }}
      >
        <FilterSearch
          handleDate={handleDate}
          handleLimit={handleLimit}
          handleSearch={handleSearch}
          handleFilter={handleFilter}
        />
        <AuctionTable
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
  );
};

export default Page;
