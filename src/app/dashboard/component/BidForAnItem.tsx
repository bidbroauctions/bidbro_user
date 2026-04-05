// components/BidForAnItem.tsx
"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "../component/Button";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CategoryService from "@/app/api/CategoryService";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";

export const BidForAnItem = ({ type }: { type: "user" | "company" }) => {
  const router = useRouter();
  function pushToAddItem() {
    if (type === "user") {
      router.push("/dashboard/user/place_bid");
    } else router.push("/dashboard/my_auctions/add_auction");
  }

  const { categories, setCategories } = useUserStore();
  useEffect(() => {
    CategoryService.FetchCategoriesService({}).then((response) => {
      if (response.success) {
        setCategories(response.data.records);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className="w-full h-fit rounded-xl space-y-6 p-6 bg-white"
      style={{
        boxShadow: "0px 1px 3px 0px #1018281A",
      }}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center w-full">
          <h1 className="w-full font-bold text-lg text-[#101828]">
            {type === "user" ? "Bid for an item" : "Auction an item"}
          </h1>

          <Button className="w-fit flex-shrink-0" onClick={pushToAddItem}>
            <PlusIcon className="w-6 h-6" />
            <p>Add an Item</p>
          </Button>
        </div>
        <p className="text-sm text-[#585757]">
          {type === "user"
            ? "Select a category to view available items for auction"
            : "Add an item for auction to get started."}
        </p>
      </div>
      <div className="flex gap-4 w-full">
        {type === "user"
          ? categories.map((category, id) => (
              <div
                key={id}
                className="w-full bg-[#FEF3EB] border-[#FEF3EB] border flex flex-col items-center justify-center rounded-lg p-4 space-y-4"
                style={{
                  boxShadow: "0px 0.48px 1.45px 0px #1018281A",
                }}
              >
                <div>
                  <Image src={category.imageUrl} alt="" className="w-12 h-12" />
                </div>
                <p>{category.name}</p>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};
