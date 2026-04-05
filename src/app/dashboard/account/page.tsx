/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import TransactionsTable, {
  TransactionTableData,
} from "./component/table/Table";
import toast from "react-hot-toast";
import { PaginationResponse, Transaction, TransactionStatus } from "@/types";
import FilterSearch from "../component/FilterSearch";
import PaginationComponent from "../component/Pagination";
import WalletService from "@/app/api/WalletService";

import { formatDate, getTimeHoursAndMinutes } from "@/app/helpers/date.utils";
import BxWalletAlt from "@/assets/icons/Secondary/Outline/bx-wallet-alt";
import {
  ChevronRightIcon,
  EyeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Button from "../component/Button";
import Image from "next/image";
import BigWallet from "@/assets/images/bigWallet.png";
import { formatString } from "@/app/helpers/helpers";
/* eslint-disable @next/next/no-img-element */

const headers = [
  { key: "date", label: "Date" },
  { key: "transactionType", label: "Transaction Type" },
  { key: "amount", label: "Amount" },

  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

const statusColors: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: "bg-[#E0F7FA] text-[#00796B]", // Light blue with teal text
  [TransactionStatus.PROCESSING]: "bg-[#FEF3EB] text-[#965521]", // Light orange with brown text
  [TransactionStatus.SUCCESS]: "bg-[#E8F5E9] text-[#388E3C]", // Light green with dark green text
  [TransactionStatus.FAILED]: "bg-[#FDEDEC] text-[#D32F2F]", // Light red with dark red text
  [TransactionStatus.PARTIAL]: "bg-[#FFFDE7] text-[#F57F17]", // Light yellow with amber text
};

const Page = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [response, setResponse] = useState<PaginationResponse<Transaction>>({
    name: "",
    size: 1,
    limit: 1,
    page: 1,
    pageCount: 1,
    previousPage: null,
    nextPage: null,
    totalItems: 1,
    records: [],
  });
  const [tableData, setTableData] = useState<TransactionTableData[]>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [filter, setFilter] = useState("");

  const fetchData = useCallback(
    async ({
      limit,
      page,
    }: {
      limit?: number;
      page?: number;
      startsAfter?: string;
      endsAfter?: string;
      search?: string;
    }) => {
      WalletService.FetchAllTransactionsService({
        sort: "createdAt:desc",
        page,
        limit,
      }).then((response) => {
        console.log(response);
        if (response.success && response?.data?.records) {
          setTransactions(response?.data?.records);
          setResponse(response.data);
          const formattedData = response.data.records.map((transaction) => {
            return {
              ...transaction,
              date:
                transaction.createdAt &&
                `${formatDate(
                  transaction.createdAt
                )} - ${getTimeHoursAndMinutes(transaction.createdAt)}`,
              transactionType: formatString(transaction.type),
              amount: `₦${
                transaction?.transactionAmount?.toLocaleString() || 0.0
              }`,
              status: transaction.status.replace("_", " ").toLowerCase(),
              statusType: transaction.status,
              id: transaction.id,
            } as TransactionTableData;
          });
          setTableData(formattedData);
        } else {
          toast.error(response.message);
        }
      });
    },
    []
  );

  useEffect(() => {
    if (transactions.length < 1) fetchData({ limit, page });
  }, [fetchData, limit, page, transactions]);

  function handleLimit(limit: number) {
    setLimit(limit);
    fetchData({ limit, page });
  }

  function handleFilter(filter: string) {
    setFilter(filter);
  }

  function handlePageChange(page: number) {
    setPage(page);
    fetchData({ limit, page });
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex w-full space-x-6 font-sans text-[#101828]">
          <div className="flex-[1_1_100%]">
            <div className="border-[#00A991] border bg-[#D9F2EF] rounded-2xl space-y-6 p-4 w-full h-full">
              <div className="flex items-center space-x-4">
                <BxWalletAlt color="#101828" />

                <p className="text-sm"> Your wallet</p>
              </div>
              <div className="flex items-center w-full justify-between">
                <div className="space-y-4">
                  <p className="text-lg ">Total balance</p>
                  <div className="flex w-full justify-between">
                    <h3 className="flex space-x-4 items-center">
                      <span className="text-3xl font-semibold">₦170,000</span>
                      <EyeIcon className="h-6 w-6 text-current" />
                    </h3>
                  </div>
                </div>
                <Button className="w-fit flex-shrink-0 text-white">
                  <span className="text-sm">Withdraw</span>
                  <ChevronRightIcon className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-[1_1_100%]">
            <div className="border-[#00A991] border bg-[#D9F2EF] rounded-2xl space-y-6 p-4 w-full h-full">
              <div className="flex items-center space-x-4">
                <LockClosedIcon className="w-6 h-6 text-[#101828]" />

                <p className="text-sm">Vault</p>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="space-y-4">
                  <p className="text-lg ">Balance</p>
                  <div className="flex w-full justify-between">
                    <h3 className="flex space-x-4 items-center">
                      <span className="text-3xl font-semibold">₦170,000</span>
                      <EyeIcon className="h-6 w-6 text-current" />
                    </h3>
                  </div>
                </div>

                <Image
                  alt=""
                  src={BigWallet}
                  width={77}
                  height={77}
                  className="w-20 h-20"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="w-full font-bold text-lg text-[#101828]">
            Transactions
          </h1>
        </div>

        <div
          className="w-full h-full rounded-xl space-y-6 bg-white"
          style={{
            boxShadow: "0px 1px 3px 0px #1018281A",
          }}
        >
          <FilterSearch handleLimit={handleLimit} handleFilter={handleFilter} />
          <TransactionsTable
            headers={headers}
            data={tableData}
            statusColors={statusColors}
            renderImage={true}
          />
          <PaginationComponent
            data={response}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
