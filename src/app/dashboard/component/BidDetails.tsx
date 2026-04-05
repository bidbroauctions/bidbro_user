import Image from "next/image";
import BxPurchaseTagAlt from "@/assets/icons/Secondary/Outline/bx-purchase-tag-alt";
import BxCalendar from "@/assets/icons/Secondary/Outline/bx-calendar";
import { formatDate } from "@/app/helpers/date.utils";
import { Bid } from "@/types";
import Link from "next/link";

interface BidDetailsProps {
  currentBid: Bid;
}

const BidDetails = ({ currentBid }: BidDetailsProps) => {
  return (
    <>
      <div className="mb-5">
        <Image
          src={currentBid.item.media[0].url!}
          alt={currentBid.item.make}
          width={1000}
          height={500}
          className="w-full max-h-[200px] h-full rounded-2xl object-cover"
        />
      </div>
      <div className="space-y-6 text-sm">
        <div className="space-y-2">
          <p className="text-[#009883] font-semibold">
            {currentBid.item.category.name}
          </p>
          <div className="space-y-2">
            <p className="flex space-x-1 text-lg text-[#101828] font-semibold">
              <span className="font-bold">
                {currentBid.item.make
                  ? currentBid.item.make + " " + currentBid.item.model
                  : ""}
              </span>
            </p>
            <p className="text-base text-[#585757] ">
              <span className="line-clamp-2">
                {currentBid.item.description}
              </span>
              <Link href={`/dashboard/my_bids/${currentBid.id}`}>
                <span className="text-[#965521] underline"> read more...</span>
              </Link>
            </p>
            <p className="text-[#585757] text-base space-x-1">
              <span className="font-semibold">Starting price:</span>
              <span>
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(currentBid.item.startAmount)}
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
              }).format(currentBid.item.buyNowPrice)}
            </span>
          </p>
          <p className="flex space-x-2 items-center">
            <BxCalendar />
            <span>{formatDate(currentBid.item.createdAt)}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default BidDetails;
