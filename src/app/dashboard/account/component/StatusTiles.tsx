"use client";
import CircularProgress from "@/app/auth/complete_registration/components/ProgressBar/CircularProgressBar";
import { formatNumberWithCommas } from "@/app/helpers/currency";
import React from "react";

const StatusTiles = () => {
  const wonBids = 250;
  const lostBids = 750;
  const totalBids = wonBids + lostBids;
  const wonPercentage = (wonBids / totalBids) * 100;
  const lostPercentage = (lostBids / totalBids) * 100;
  return (
    <div
      className="w-full h-full rounded-xl space-y-6 p-6 bg-white"
      style={{
        boxShadow: "0px 1px 3px 0px #1018281A",
      }}
    >
      <h1 className="text-[#363435] font-bold text-base">Status</h1>
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center space-x-6">
          <CircularProgress
            progress={wonPercentage}
            size={150}
            strokeWidth={30}
            renderText={<span>100%</span>}
          />
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#009883]"></div>
              <p>Won</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#D9F2EF]"></div>
              <p>Lost</p>
            </div>
            <div className="text-[#363435] font-bold text-xl mt-6">Total</div>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-6">
            <p className=" ">{wonPercentage}%</p>
            <p className="font-extrabold ">{wonBids}</p>
          </div>
          <div className="flex items-center space-x-6">
            <p className=" ">{lostPercentage}%</p>
            <p className="font-extrabold ">{lostBids}</p>
          </div>
          <div className="text-[#363435] font-extrabold text-xl mt-6">
            {formatNumberWithCommas(totalBids)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusTiles;
