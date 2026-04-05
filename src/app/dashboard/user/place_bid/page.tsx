"use client";
import { ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React from "react";
import BxPurchaseTagAlt from "@/assets/icons/Secondary/Outline/bx-purchase-tag-alt";
import BxCalendar from "@/assets/icons/Secondary/Outline/bx-calendar";
import { formatDate } from "@/app/helpers/date.utils";
import Image from "next/image";
import { ArrowDownLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { auctions } from "@/app/mock/auction";
const Page = () => {
  const router = useRouter();
  function goBack() {
    router.back();
  }

  const auctionList = auctions;

  return (
    <div className="space-y-6 text-[#101828] mr-[80px]">
      <div
        onClick={goBack}
        className="flex cursor-pointer w-full space-x-4 items-center px-6 py-4 border-b border-b-[#EBEBEB] text-[#101828] text-base font-semibold"
      >
        <ChevronLeftIcon className="w-5 h-5 text-[#363435] cursor-pointer" />
        <p>Back</p>
      </div>
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-semibold ">Ongoing auctions for cars.</h1>
        <div className="px-4 py-3 flex items-center justify-between w-fit space-x-1 rounded-lg cursor-pointer border border-[#EBEBEB] bg-white ">
          <div className="text-sm text-[#363435] font-semibold">
            <span>Category: </span>
            <span>Cars</span>
          </div>
          <ChevronDownIcon className="w-5 h-5 text-[#363435] cursor-pointer" />
        </div>
      </div>
      {/* Auctions List */}
      <div className="grid grid-cols-4 gap-6">
        {auctionList.map((item, id) => (
          <Link key={id} href={`/dashboard/user/place_bid/${id}`} passHref>
            <div className="cursor-pointer">
              <div className="mb-5">
                <Image
                  src={item.media[0].url!}
                  width={1000}
                  height={500}
                  alt={item.media[0].description || item.make}
                  className="w-full h-[240px]  rounded-2xl object-cover"
                />
              </div>
              <div className="space-y-6 text-sm">
                <div className="space-y-2">
                  <p className="text-[#009883] font-semibold">
                    {item.category.name}
                  </p>
                  <div className="space-y-2">
                    <p className="flex items-center justify-between space-x-1 text-lg text-[#101828] font-semibold">
                      <span className="font-bold">{item.make}</span>
                      <ArrowDownLeftIcon className="w-5 h-5 text-[#363435] cursor-pointer rotate-180" />
                    </p>
                    <p className="text-base text-[#585757] ">
                      <span className="line-clamp-2">{item.description}</span>
                    </p>
                    <p className="text-[#585757] text-base space-x-1">
                      <span className="font-semibold">Starting price:</span>
                      <span>
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(item.startAmount)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="space-x-4 flex text-[#475467] text-base">
                  <p className="flex space-x-2 items-center">
                    <BxPurchaseTagAlt />
                    <span>
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.reservedPrice)}
                    </span>
                  </p>
                  <p className="flex space-x-2 items-center">
                    <BxCalendar />
                    <span>{formatDate(item.createdAt)}</span>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
