"use client";
import React, { useEffect } from "react";
import { ActiveBids } from "../component/ActiveBids";
import { YourWallet } from "../component/YourWallet";
import { RecentAuctions } from "../component/TopAuction";
import { BidForAnItem } from "../component/BidForAnItem";
import { Bid, CompanyStatus } from "@/types";
import { auctions, bids } from "@/app/mock/auction";
import WalletService from "@/app/api/WalletService";
import { useDashboardContext } from "../context/DashboardContext";
import { useUserStore } from "@/store/useUserStore";
import { getMyAccount } from "@/app/auth/api/AuthService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CompanyDashboard = () => {
  const activeBids: Bid[] = bids;
  const router = useRouter();
  const { setUser, setCompany, company } = useUserStore();
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
  const auctionList = auctions;
  const isReviewed = company?.status === CompanyStatus.ACTIVE;

  /*
  if (company?.status === CompanyStatus.PARTIAL) {
    router.push("/auth/complete_registration/company");
  }
  */
  return !isReviewed ? (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="w-full flex flex-col space-y-6">
          <BidForAnItem type="company" />
          <ActiveBids activeBids={activeBids} type="company" />
        </div>
        <YourWallet type="company" />
      </div>
      <RecentAuctions auctionList={auctionList} type="company" />
    </div>
  ) : (
    <div className="space-y-2 rounded-lg p-2 bg-[#D9F2EF] text-[#262425] w-fit">
      <h1 className="text-base font-bold">Welcome</h1>
      <p className=" text-sm font-medium">
        Your account is under review, please be patient.
      </p>
    </div>
  );
};

export default CompanyDashboard;
