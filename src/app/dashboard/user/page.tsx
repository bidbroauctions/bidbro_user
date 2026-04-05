"use client";
import React, { useEffect } from "react";

import { ActiveBids } from "../component/ActiveBids";
import { YourWallet } from "../component/YourWallet";
import { RecentAuctions } from "../component/TopAuction";
import { BidForAnItem } from "../component/BidForAnItem";
import { bids, auctions } from "@/app/mock/auction";
import { useUserStore } from "@/store/useUserStore";
import { useDashboardContext } from "../context/DashboardContext";
// import toast from "react-hot-toast";
import WalletService from "@/app/api/WalletService";
import { getMyAccount } from "@/app/auth/api/AuthService";

const UserDashboard = () => {
  const { setUser, setCompany } = useUserStore();
  const { bankAccountDetails, setBankAccountDetails } = useDashboardContext();
  useEffect(() => {
    getMyAccount().then((response) => {
      if (response.success) {
        setUser(response.data.user);
        setCompany(response.data.company);
      } else {
        /*
        toast.error(response.message, {
          position: "top-center",
        });
        */
      }
    });

    if (!bankAccountDetails) {
      WalletService.FetchAllAccountsService({}).then((response) => {
        if (response.success) {
          setBankAccountDetails(response.data.records);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="w-full flex flex-col space-y-6">
          <BidForAnItem type="user" />
          <ActiveBids activeBids={bids} type="user" />
        </div>
        <YourWallet type="user" />
      </div>
      <RecentAuctions auctionList={auctions} type="user" />
    </div>
  );
};

export default UserDashboard;
