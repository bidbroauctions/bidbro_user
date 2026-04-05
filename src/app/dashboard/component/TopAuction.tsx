import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import BxPurchaseTagAlt from "@/assets/icons/Secondary/Outline/bx-purchase-tag-alt";
import BxCalendar from "@/assets/icons/Secondary/Outline/bx-calendar";
import { formatDate } from "@/app/helpers/date.utils";
import { Auction } from "@/types";

export const RecentAuctions = ({
  auctionList,
  type,
}: {
  auctionList: Auction[];
  type: "user" | "company";
}) => {
  return (
    <div
      className="w-full rounded-xl space-y-6 p-6 bg-white"
      style={{
        boxShadow: "0px 1px 3px 0px #1018281A",
      }}
    >
      <div className="flex w-full justify-between items-center">
        <p className="text-lg text-[#101828] font-medium">
          {type === "user"
            ? "Top ongoing auctions"
            : "Recently closed auctions"}
        </p>
        <div className="text-sm text-[#AC6126] font-semibold flex items-center space-x-2">
          <span>View all</span>
          <ChevronRightIcon className="w-5 h-5 text-[#AC6126]" />
        </div>
      </div>
      <div className="space-y-5">
        {auctionList.map((item, id) => (
          <div key={id} className="flex space-x-5">
            <div className="w-full">
              <Image
                src={item.media[0].url!}
                alt=""
                width={1000}
                height={500}
                className="w-full max-h-[250px] h-full object-cover rounded-2xl"
              />
            </div>
            <div className="w-full flex-grow flex flex-col">
              <div className="space-y-6 text-sm flex-grow">
                <div className="space-y-2">
                  <p className="text-[#009883] font-semibold">
                    {item.category.name}
                  </p>
                  <div className="space-y-2">
                    <p className="flex space-x-1 text-lg text-[#101828] font-semibold">
                      <span className="font-bold">{item.make}</span>
                    </p>
                    <p className="text-base text-[#585757] line-clamp-2">
                      {item.description}
                    </p>
                    <span className="text-[#965521] underline">
                      read more...
                    </span>
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
                      }).format(item.buyNowPrice)}
                    </span>
                  </p>
                  <p className="flex space-x-2 items-center">
                    <BxCalendar />
                    <span>{formatDate(item.createdAt)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
