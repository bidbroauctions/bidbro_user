"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Bid, BidStatus } from "@/types";
import Link from "next/link";

// Define the table component props
/* eslint-disable @typescript-eslint/no-explicit-any */
interface TableProps {
  headers: { key: string; label: string }[];
  data: BiddingTableData[];
  statusColors: Record<BidStatus, string>;
  renderImage?: boolean; // Optional custom image render
}
export interface BiddingTableData {
  name: string;
  id: string;
  lotNumber: string;
  category: string;
  startingPrice: string;
  bidAmount: string;
  status: string;
  statusType: BidStatus;
  images: (StaticImageData | string)[];
}

const BidsTable = ({
  headers,
  data,
  statusColors,
  renderImage,
}: TableProps) => {
  const router = useRouter();
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const handleAction = () => {
    console.log(selectedBid);
    if (!selectedBid) return;
    router.push(`/dashboard/my_bids/${selectedBid?.id}`);
  };
  function handleSelectBid(bid: any) {
    setSelectedBid(bid);
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-[#EBEBEB] border-b border-[#DBDCDD]">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className="py-3 px-6 text-[#363435] text-xs text-left font-semibold space-x-4"
              >
                {header.key === "name" && (
                  <input
                    type="checkbox"
                    name="name"
                    id=""
                    className="input checkbox"
                  />
                )}
                <span>{header.label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-b-[#DBDCDD] text-[#363435] text-xs font-medium"
                onClick={() => handleSelectBid(item)}
              >
                <td className="px-6 py-4 flex items-center space-x-3">
                  {renderImage && (
                    <Image
                      src={item.images?.[0]}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  )}
                  <span className="font-bold text-xs text-[#4B5887]">
                    {item.name}
                  </span>
                </td>
                <td className="px-6 py-4">{item.lotNumber}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{item.startingPrice}</td>
                <td className="px-6 py-4">{item.bidAmount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-[2px] font-medium rounded-full ${
                      statusColors[item.statusType]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/dashboard/my_bids/${item.id}`}>
                    <button className="text-[#363435]" onClick={handleAction}>
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                No bids available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BidsTable;
