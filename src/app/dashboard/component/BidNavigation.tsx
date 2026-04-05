import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface BidNavigationProps {
  currentIndex: number;
  totalLength: number;
  isNextAuction: boolean;
  isPrevAuction: boolean;
  handleNext: () => void;
  handlePrev: () => void;
  type: "user" | "company";
}

const BidNavigation = ({
  currentIndex,
  totalLength,
  isNextAuction,
  isPrevAuction,
  handleNext,
  handlePrev,
  type,
}: BidNavigationProps) => {
  return (
    <div className="flex w-full mb-2 justify-between items-center">
      <p className="text-lg font-medium">
        {type === "user" ? "Your active bids" : "Your active auctions"}
      </p>
      <div className="flex space-x-2 items-center">
        <ChevronLeftIcon
          className={classNames("w-5 h-5 text-[#363435] cursor-pointer", {
            "opacity-50": !isPrevAuction,
          })}
          onClick={handlePrev}
        />
        <div className="flex space-x-1">
          <span>{currentIndex + 1} </span>
          <span>of </span>
          <span>{totalLength}</span>
        </div>
        <ChevronRightIcon
          className={classNames("w-5 h-5 text-[#363435] cursor-pointer", {
            "opacity-50": !isNextAuction,
          })}
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default BidNavigation;
