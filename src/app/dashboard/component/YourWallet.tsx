"use client";
// components/YourWallet.tsx
import Button from "../component/Button";
import {
  ChevronRightIcon,
  EyeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import BxsArrowCircle from "@/assets/icons/Secondary/Solid/bxs-right-top-arrow-circle";
import { formatDate } from "@/app/helpers/date.utils";
import ReUseModal from "@/components/Modal/ReUseModal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Input from "@/components/form/input";
import PaymentIcon from "@/assets/icons/wallet";
import BxArch from "@/assets/icons/Secondary/Outline/bx-arch";
import SuccessGif from "@/assets/images/success.gif";
import FailCheckIcon from "@/assets/icons/FailCheckIcon.svg";
import Image from "next/image";
import {
  formatCurrency,
  formatFromCurrencyToNumber,
} from "@/app/helpers/currency";
import { useDashboardContext } from "../context/DashboardContext";
import WalletService from "@/app/api/WalletService";
import toast from "react-hot-toast";
import {
  Wallet as IWallet,
  Transaction,
  TransactionStatus,
  USER_TYPE,
} from "@/types";

export const YourWallet = ({ type }: { type?: "user" | "company" }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    WalletService.FetchAllTransactionsService({
      limit: type === "company" ? 4 : 5,
    }).then((response) => {
      if (response.success) {
        setTransactions(response.data.records);
      } else {
        toast.error(response.message);
      }
    });
  }, [type]);

  const [openModal, setOpenModal] = useState(false);
  function openWithdrawalModal() {
    setOpenModal(true);
  }
  const [walletBalance, setWalletBalance] = useState<IWallet[]>([]);

  useEffect(() => {
    WalletService.FetchWalletBalance().then((response) => {
      if (response.success) {
        const dummyWallet: IWallet = {
          id: "",
          entityId: "",
          entityType: USER_TYPE[type as keyof typeof USER_TYPE],
          bookBalance: 0.0,
          availableBalance: 0.0,
          type: "WALLET",
          currency: "NGN",
          frozen: false,
        };
        if (response.data.records.length > 0)
          setWalletBalance(response.data.records);
        else setWalletBalance([dummyWallet]);
      } else {
        toast.error(response.message);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className="bg-white rounded-xl p-6 border border-[#F9FAFB] w-full max-w-[450px] min-h-[750px] space-y-6"
        style={{
          boxShadow: "0px 1px 3px 0px #1018281A",
        }}
      >
        <div className="flex justify-between items-center">
          <p className="font-medium text-lg text-[#101828]">Your wallet</p>
          <Button
            type="button"
            onClick={openWithdrawalModal}
            className="flex items-center space-x-2"
          >
            <p className="">Withdraw</p>
            <ChevronRightIcon className="w-6 h-6" />
          </Button>
        </div>
        <div className="bg-[#D9F2EF] py-4 rounded-2xl border border-[#00A991] gap-6 flex flex-col w-full justify-center items-center text-white">
          <p className="text-[#101828] font-normal text-lg">Total balance</p>
          <p className="flex items-center gap-4 text-[#101828] font-semibold text-3xl">
            <span>
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(walletBalance[0]?.availableBalance || 0)}
            </span>
            <EyeIcon className="w-5 h-5" />
          </p>
        </div>
        <div>
          <p className="text-[#101828] font-normal text-lg">
            Recent transactions
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {transactions.length > 0 ? (
            transactions.map((transaction, id) => (
              <div
                key={id}
                className="flex justify-between p-4 gap-6 text-sm text-[#262425] items-center rounded-2xl border border-[#EAECF0] bg-[#F2F4F7]"
              >
                <div className="flex space-x-2 items-start">
                  <div className="mt-1">
                    <BxsArrowCircle
                      color={
                        transaction.status === TransactionStatus.FAILED
                          ? "#EB5757"
                          : "#009883"
                      }
                      direction={
                        transaction.status === TransactionStatus.FAILED
                          ? "right_top"
                          : "right_bottom"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(transaction.transactionAmount)}
                    </p>
                    <p className="text-[#667085]">{transaction.status}</p>
                  </div>
                </div>
                <div>
                  <p>{formatDate(transaction.createdAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <div>No transactions available</div>
          )}
        </div>
      </div>
      <ReUseModal
        open={openModal}
        setOpen={setOpenModal}
        parentClassName="sm:max-w-xl w-full"
        addCloseIcon
      >
        <WithdrawalModal setOpenModel={setOpenModal} />
      </ReUseModal>
    </>
  );
};

function WithdrawalModal({
  setOpenModel,
}: {
  setOpenModel: Dispatch<SetStateAction<boolean>>;
}) {
  const { bankAccountDetails, setBankAccountDetails } = useDashboardContext();
  const hasBankAccount = bankAccountDetails.length > 0;
  useEffect(() => {
    // Only trigger the modal if no bank account is available
    if (bankAccountDetails.length === 0) {
      // Fetch bank account details
      WalletService.FetchAllAccountsService({})
        .then((response) => {
          if (response.success) {
            setBankAccountDetails(response.data.records);
          }
        })
        .catch(() => {
          // Handle potential errors in fetching bank accounts
          toast.error(
            "An error occurred while fetching your bank account details"
          );
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bankDetails = [
    {
      type: "accountName",
      value: bankAccountDetails?.[0]?.accountName,
      icon: UserCircleIcon,
    },
    {
      type: "accountNumber",
      value: bankAccountDetails?.[0]?.accountNumber,
      icon: PaymentIcon,
    },
    {
      type: "bankName",
      value: bankAccountDetails?.[0]?.bankName,
      icon: BxArch,
    },
  ];

  const [amount, setAmount] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(true);
  //   0 for default, 1 for success, -1 for failed
  const [successRate, setSuccessRate] = useState(0);
  function handleAmountChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const inputValue = e.target.value.replace(/[^\d.]/g, ""); // Allow only numbers
    setAmount(formatCurrency(inputValue)); // Format input value
    setIsDisabled(inputValue === "" || parseFloat(inputValue) < 1); // Disable button if input is invalid
  }
  function handleCloseModal() {
    setOpenModel(false);
  }
  function handleSubmit() {
    // simulate a successful withdrawal or failed withdrawal, randomly
    const newAmount = formatFromCurrencyToNumber(amount);
    console.log(newAmount);
    const random = Math.random();
    if (random > 0.5) setSuccessRate(1);
    else setSuccessRate(-1);
  }
  function handleAddABankAccount() {
    // Redirect to add bank account page
    console.log("Redirect to add bank account page");
  }
  return (
    <>
      {successRate === 0 ? (
        <div className="w-full">
          <h1 className="text-3xl text-[#101828] mb-6 ">Withdraw</h1>
          <div className="space-y-6">
            <Input
              label="Amount"
              placeholder="₦0.00"
              value={amount}
              onChange={handleAmountChange}
              type="text"
            />
            <div className="w-full space-y-2">
              <p>Your account details:</p>
              <div className="w-full space-y-4">
                {hasBankAccount ? (
                  bankDetails.map((detail, id) => (
                    <div
                      key={id}
                      className="flex items-center px-4 py-6 space-x-7 rounded-lg bg-[#F2F4F7] border border-[#EAECF0] text-sm text-[#182230"
                    >
                      <detail.icon className="w-6 h-6" />
                      <p>{detail.value}</p>
                    </div>
                  ))
                ) : (
                  <p>No bank account details available</p>
                )}
              </div>
            </div>
            <Button
              className="w-full"
              disabled={isDisabled}
              type="button"
              onClick={() =>
                hasBankAccount ? handleSubmit() : handleAddABankAccount()
              }
            >
              {hasBankAccount ? "Withdraw" : "Add bank account"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-8">
          <div className="space-y-5 flex flex-col items-center text-center">
            <Image
              src={successRate === 1 ? SuccessGif : FailCheckIcon}
              alt=""
              className="w-24 h-24"
            />
            <p className="text-2xl font-semibold text-[#101828]">
              {" "}
              {successRate === 1 ? "Nice move" : "Failed!"}
            </p>
            <p className="text-sm text-[#475467]">
              {successRate === 1
                ? "Your withdrawal was successful"
                : "Sorry, we could not process your withdrawal at this time. Please try again later."}
            </p>
          </div>
          <Button type="button" onClick={handleCloseModal} className="w-full">
            Got it
          </Button>
        </div>
      )}
    </>
  );
}
