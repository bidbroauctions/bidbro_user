"use client";
import { useState } from "react";
import { Bid } from "@/types";
import BidNavigation from "./BidNavigation";
import BidDetails from "./BidDetails";

export const ActiveBids = ({
  activeBids,
  type,
}: {
  activeBids: Bid[];
  type: "user" | "company";
}) => {
  const [currentAuctionIndex, setCurrentAuctionIndex] = useState(0);
  const totalLength = activeBids.length;
  const currentBid = activeBids[currentAuctionIndex];
  const isNextAuction = currentAuctionIndex < totalLength - 1;
  const isPrevAuction = currentAuctionIndex > 0;

  // Handle moving to the previous auction
  const handlePrev = () => {
    if (!isPrevAuction) return;
    setCurrentAuctionIndex((prevIndex) =>
      prevIndex === 0 ? 0 : prevIndex - 1
    );
  };

  // Handle moving to the next auction
  const handleNext = () => {
    if (!isNextAuction) return;
    setCurrentAuctionIndex((prevIndex) =>
      prevIndex === totalLength - 1 ? totalLength - 1 : prevIndex + 1
    );
  };

  return (
    <div
      className="bg-white flex-grow rounded-xl text-[#101828] p-6 border border-[#F9FAFB] w-full h-full"
      style={{
        boxShadow: "0px 1px 3px 0px #1018281A",
      }}
    >
      <BidNavigation
        currentIndex={currentAuctionIndex}
        totalLength={totalLength}
        isNextAuction={isNextAuction}
        isPrevAuction={isPrevAuction}
        handleNext={handleNext}
        handlePrev={handlePrev}
        type={type}
      />
      <BidDetails currentBid={currentBid} />
    </div>
  );
};
