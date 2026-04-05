"use client";
import { formatString } from "@/app/helpers/helpers";
import { AuctionStatus } from "@/types";
import React from "react";

const StatusTiles = () => {
  const data = Object.values(AuctionStatus)
    .map((status) => {
      return {
        status,
        count: 0,
      };
    })
    .filter((item) => item.count > 0)
    .filter((item, id) => id < 5);

  return (
    <div
      className="w-full h-full rounded-xl space-y-6 p-6 bg-white text-[#363435]"
      style={{
        boxShadow: "0px 1px 3px 0px #1018281A",
      }}
    >
      <h1 className="text-[#363435] font-bold text-base">Status</h1>
      <div className="flex items-center w-full justify-between">
        <div className="flex w-full items-center justify-between space-x-2">
          {data.map((item, id) => (
            <div
              className="border-[#EBEBEB] p-4 border space-y-2 rounded-lg bg-[#FEF3EB] w-full"
              key={id}
            >
              <p className="text-sm font-medium">{formatString(item.status)}</p>
              <p className="text-2xl font-extrabold">{item.count}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full items-center justify-between font-bold text-xl">
        <p>Total:</p>
        <p className="text-2xl">
          {data.reduce((acc, item) => acc + item.count, 0)}
        </p>
      </div>
    </div>
  );
};

export default StatusTiles;
