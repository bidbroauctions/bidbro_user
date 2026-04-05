"use client";
import React from "react";

import Button from "@/app/dashboard/component/Button";
import Carousel from "@/app/dashboard/component/Carousel";

import { formatDate, getTimeHoursAndMinutes } from "@/app/helpers/date.utils";

import { Auction } from "@/types";
import {
  fetchMediaImages,
  fetchMediaVideos,
  formatString,
} from "@/app/helpers/helpers";
import VideoComponent from "./VideoComponent";

interface detailListProp {
  type: string;
  label: string;
  value: string;
}
const AuctionCard = ({
  auction,
  handlePlaceABid,
}: {
  auction: Auction;
  handlePlaceABid(): void;
  pageType: "my_auctions" | "my_bids" | "place_bid";
}) => {
  const detailsList: detailListProp[] = [
    {
      type: "category",
      label: "Category",
      value: auction?.category.name || "",
    },
    {
      type: "datePublished",
      label: "Date published",
      value: auction?.createdAt
        ? `${formatDate(auction.createdAt)} - ${getTimeHoursAndMinutes(
            auction.createdAt
          )}`
        : "",
    },
    {
      type: "closingDate",
      label: "Closing date",
      value: auction?.createdAt
        ? `${formatDate(auction.auctionEndDate)} - ${getTimeHoursAndMinutes(
            auction.createdAt
          )}`
        : "",
    },
    {
      type: "make",
      label: "Make",
      value: auction?.make || "",
    },
    {
      type: "model",
      label: "Model",
      value: auction?.model || "",
    },
    {
      type: "yearOfPurchase",
      label: "Year of purchase",
      value: auction?.yearOfPurchase || "",
    },
    {
      type: "purchasedNewOrUsed",
      label: "Purchased new or used",
      value: formatString(auction?.purchaseStatus || ""),
    },
    {
      type: "functionality",
      label: "Functionality",
      value: formatString(auction?.functional || ""),
    },
    {
      type: "location",
      label: "Location",
      value: auction?.location.fullAddress || "",
    },
    {
      type: "startingPrice",
      label: "Starting price",
      value: `₦${auction?.startAmount?.toLocaleString() || 0.0}`,
    },
    {
      type: "buyNowPrice",
      label: "Buy now price",
      value: `₦${auction?.buyNowAmount?.toLocaleString() || 0.0}`,
    },
    {
      type: "releasePeriod",
      label: "Release period",
      value: auction?.conclusionDate
        ? `${formatDate(auction.conclusionDate)} - ${getTimeHoursAndMinutes(
            auction.conclusionDate
          )}`
        : "",
    },
  ];
  const auctionImages = fetchMediaImages(auction?.media || []);
  const auctionVideos = fetchMediaVideos(auction?.media || []);
  console.log({ auctionImages, auctionVideos });
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between w-full">
          <div className="w-full">
            <h1 className="text-3xl font-semibold">
              {auction?.make ? auction?.make + " " + auction?.model : ""}
            </h1>
          </div>
          <div className="flex space-x-6 w-full justify-end">
            <Button
              onClick={handlePlaceABid}
              className="bg-[#fff] !text-[#AC6126] border-[#AC6126] space-x-2 max-w-[160px] w-full"
            >
              Buy Now
            </Button>
            <Button
              onClick={handlePlaceABid}
              className="text-white space-x-2 max-w-[160px] w-full"
            >
              Place a bid
            </Button>
          </div>
        </div>
        <div className="flex space-x-8 ">
          <div className="w-full space-y-6">
            <Carousel images={auctionImages} />
            <p className="text-base leading-[25.6px] font-normal text-[#585757]">
              {auction?.description}
            </p>
          </div>
          <div className="space-y-4 w-full">
            <p className="flex text-sm text-[#F68B36] space-x-2">
              <span>Lot #:</span>
              <span>{auction?.lotNumber}</span>
            </p>
            <div>
              {detailsList.map((detail, id) => (
                <div
                  key={id}
                  className="py-3 flex text-sm font-semibold text-[#585757] justify-between space-y-2 border-b border-b-[#EBEBEB]"
                >
                  <p>{detail.label}:</p>
                  <p className="font-normal ">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <VideoComponent videos={auctionVideos} />
      </div>
    </>
  );
};

export default AuctionCard;
