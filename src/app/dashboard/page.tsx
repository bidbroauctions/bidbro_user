"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useDashboardContext } from "./context/DashboardContext";
import WalletService from "../api/WalletService";
import { getMyAccount } from "../auth/api/AuthService";
// import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const { company, setUser, setCompany } = useUserStore();
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
  useEffect(() => {
    // Replace this logic with the condition to choose between /dashboard/user or /dashboard/company
    const isCompanyAccount = company?.id;
    const destination = !isCompanyAccount
      ? "/dashboard/user"
      : "/dashboard/company";

    // Use router.replace to avoid adding the redirect to history
    router.replace(destination);
  }, [company?.id, router]);

  return null; // Render nothing, user is immediately redirected
};

export default Page;
