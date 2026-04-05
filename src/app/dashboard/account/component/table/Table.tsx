"use client";
import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Transaction, TransactionStatus } from "@/types";
import BxsArrowCircle from "@/assets/icons/Secondary/Solid/bxs-right-top-arrow-circle";
import ReUseModal from "@/components/Modal/ReUseModal";

// Define the table component props
/* eslint-disable @typescript-eslint/no-explicit-any */
interface TableProps {
  headers: { key: string; label: string }[];
  data: TransactionTableData[];
  statusColors: Record<TransactionStatus, string>;
  renderImage?: boolean; // Optional custom image render
}
export interface TransactionTableData {
  date: string;
  id: string;
  transactionType: string;
  amount: string;
  status: string;
  statusType: TransactionStatus;
}

const TransactionsTable = ({ headers, data, statusColors }: TableProps) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const handleAction = () => {
    if (!selectedTransaction) return;

    setOpenModal(true);
  };
  function handleSelectTransaction(transaction: any) {
    setSelectedTransaction(transaction);
  }
  const [openModal, setOpenModal] = useState(true);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-[#EBEBEB] border-b border-[#DBDCDD]">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className="py-3 px-6 text-[#363435] text-xs text-left font-semibold space-x-4"
              >
                {header.key === "name" && (
                  <input
                    type="checkbox"
                    name="name"
                    id=""
                    className="input checkbox"
                  />
                )}
                <span>{header.label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-b-[#DBDCDD] text-[#363435] text-xs font-medium"
                onClick={() => handleSelectTransaction(item)}
              >
                <td className="px-6 py-4 flex items-center space-x-3">
                  <BxsArrowCircle
                    color={
                      item.statusType === TransactionStatus.FAILED
                        ? "#EB5757"
                        : "#009883"
                    }
                    direction={
                      item.statusType === TransactionStatus.FAILED
                        ? "right_top"
                        : "right_bottom"
                    }
                  />
                  <span className="font-bold text-xs text-[#4B5887]">
                    {item.date}
                  </span>
                </td>
                <td className="px-6 py-4">{item.transactionType}</td>
                <td className="px-6 py-4">{item.amount}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-[2px] font-medium rounded-full ${
                      statusColors[item.statusType]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-[#363435]" onClick={handleAction}>
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                No transaction available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedTransaction && (
        <ReUseModal
          open={openModal}
          setOpen={setOpenModal}
          parentClassName="sm:max-w-xl w-full"
          addCloseIcon={true}
        >
          <TransactionModalComponent
            transaction={selectedTransaction}
            statusColors={statusColors}
          />
        </ReUseModal>
      )}
    </div>
  );
};
interface TransactionModalComponentProps {
  transaction: Transaction;
  statusColors: Record<TransactionStatus, string>;
}

function TransactionModalComponent({
  transaction,
  statusColors,
}: TransactionModalComponentProps) {
  const details = [
    { label: "From", value: transaction.initiatedBy },
    { label: "To", value: transaction.entityId },
    {
      label: "Amount",
      value: `${transaction.currency} ${transaction.transactionAmount.toFixed(
        2
      )}`,
    },
    { label: "Narration", value: transaction.note },
    { label: "Payment mode", value: transaction.provider },
    { label: "Payment reference", value: transaction.providerReference },
    { label: "Transaction type", value: transaction.type },
    { label: "Transaction Status", value: transaction.status },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Transaction Details</h1>
      <p className="text-sm text-gray-500 mb-4">
        {new Date(transaction.createdAt).toLocaleDateString()} ||{" "}
        {new Date(transaction.createdAt).toLocaleTimeString()}
      </p>
      <div className="space-y-2">
        {details.map((detail, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200"
          >
            <span className="font-semibold text-gray-700">{detail.label}</span>
            {detail.label === "Transaction Status" ? (
              <span
                className={`px-2 py-[2px] font-medium rounded-full ${
                  statusColors[transaction.status as TransactionStatus]
                }`}
              >
                {transaction.status}
              </span>
            ) : (
              <span className="text-gray-600">{detail.value}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-2 mt-8">
        <div className="text-[#595D62] font-bold font-sans py-3 px-4">
          Cancel
        </div>
        <button className="rounded-xl font-bold font-sans py-3 px-4 bg-foundationYellowY300 w-[300px] text-white">
          Download
        </button>
      </div>
    </div>
  );
}

export default TransactionsTable;
