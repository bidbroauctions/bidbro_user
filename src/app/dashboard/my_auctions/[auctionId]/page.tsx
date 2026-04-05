"use client";
import {
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import PorsheImage from "@/assets/images/auction/porshe.jpeg";

import Image from "next/image";
import Button from "@/app/dashboard/component/Button";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import ReUseModal from "@/components/Modal/ReUseModal";
import SuccessCheckIcon from "@/assets/icons/SuccessCheckIcon";
import Input from "@/components/form/input";
import {
  formatCurrency,
  formatFromCurrencyToNumber,
} from "@/app/helpers/currency";

import SpinnerIcon from "@/assets/icons/Spinner-Dots/SpinnerIcon";
import { formatTime } from "@/app/helpers/date.utils";
import Gravel from "@/assets/icons/Gravel";
import SuccessGif from "@/assets/images/success.gif";
import FailCheckIcon from "@/assets/icons/FailCheckIcon.svg";

import WalletFail from "@/assets/icons/walletFail";
import classNames from "classnames";
import { Auction } from "@/types";
import toast from "react-hot-toast";
import AuctionCard from "../../component/AuctionCard";
import AuctionService from "@/app/api/AuctionService";

const Page = () => {
  const router = useRouter();
  function goBack() {
    router.back();
  }
  const params = useParams<{ auctionId: string }>();
  const auctionId = params.auctionId;
  const [auction, setAuction] = useState<Auction | null>(null);
  useEffect(() => {
    if (auctionId) {
      AuctionService.FetchSingleAuctionService(auctionId).then((response) => {
        if (response.success) {
          setAuction(response.data);
        } else {
          toast.error(response.message);
        }
      });
    }
  }, [auctionId]);

  const [openModal, setOpenModal] = useState(false);

  function handlePlaceABid() {
    setOpenModal(true);
  }
  const [defaultProcessBidModalType, setDefaultProcessBidModalType] =
    useState<ProcessBidModalTypes | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAccountDetailsProvided, setIsAccountDetailsProvided] =
    useState(true);
  useEffect(() => {
    if (openModal === false) setDefaultProcessBidModalType(null);
  }, [openModal]);

  return (
    <>
      <div className="space-y-6 text-[#101828] mr-[80px]">
        <div
          onClick={goBack}
          className="flex cursor-pointer w-full space-x-4 items-center px-6 py-4 border-b border-b-[#EBEBEB] text-[#101828] text-base font-semibold"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#363435] cursor-pointer" />
          <p>Back</p>
        </div>
        <div
          className="bg-white p-2 rounded-2xl  space-y-4 px-6 text-[#101828] font-sans font-bold "
          style={{
            boxShadow: "0px 1px 2px 0px #1018280F",
          }}
        >
          <p className="">Your Bid</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <Image
                src={auction?.postedBy?.imageUrl as string}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded-full"
              />
              <p className="text-[#363435] text-lg">
                {auction?.postedBy
                  ? auction?.postedBy?.firstName +
                    " " +
                    auction?.postedBy?.lastName +
                    " (You)"
                  : ""}
              </p>
            </div>
            <div>
              <h2 className="text-[#262425] text-2xl">
                {auction?.startAmount
                  ? `₦${auction?.startAmount.toLocaleString()}`
                  : ""}
              </h2>
            </div>
          </div>
        </div>
        {/*  */}
        {auction && (
          <AuctionCard
            auction={auction}
            pageType="my_auctions"
            handlePlaceABid={handlePlaceABid}
          />
        )}
      </div>
      <ReUseModal
        open={openModal}
        setOpen={setOpenModal}
        parentClassName="sm:max-w-xl w-full"
        addCloseIcon={
          defaultProcessBidModalType == ProcessBidModalTypes.PROCESS_PAYMENT
            ? false
            : true
        }
      >
        {defaultProcessBidModalType === null ? (
          <PlaceBidModal
            setOpenModal={setOpenModal}
            auction={auction as Auction}
            setDefaultProcessBidModalType={setDefaultProcessBidModalType}
            isAccountDetailsProvided={isAccountDetailsProvided}
          />
        ) : (
          <ProcessBidModal
            setOpenModal={setOpenModal}
            defaultProcessBidModalType={defaultProcessBidModalType}
            setDefaultProcessBidModalType={setDefaultProcessBidModalType}
          />
        )}
      </ReUseModal>
    </>
  );
};

function PlaceBidModal({
  setOpenModal,
  setDefaultProcessBidModalType,
  isAccountDetailsProvided,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  auction: Auction;
  setDefaultProcessBidModalType: React.Dispatch<
    React.SetStateAction<ProcessBidModalTypes | null>
  >;
  isAccountDetailsProvided: boolean;
}) {
  const [amount, setAmount] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(true);
  const reservedAmount = 170000;

  //   0 for default, 1 for success, -1 for failed

  function handleAmountChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const inputValue = e.target.value.replace(/[^\d.]/g, ""); // Allow only numbers
    setAmount(formatCurrency(inputValue)); // Format input value
    const isExceedReservedAmount = parseFloat(inputValue) > reservedAmount;

    setIsDisabled(
      inputValue === "" || parseFloat(inputValue) < 1 || isExceedReservedAmount
    ); // Disable button if input is invalid
  }
  function handleCloseModal() {
    setOpenModal(false);
  }
  function handleSubmit() {
    // simulate a successful withdrawal or failed withdrawal, randomly
    const newAmount = formatFromCurrencyToNumber(amount);
    console.log(newAmount);
    setDefaultProcessBidModalType(ProcessBidModalTypes.PROCESS_PAYMENT);
  }
  return (
    <>
      {isAccountDetailsProvided ? (
        <div className="w-full text-[#101828]">
          <div className="mb-6">
            <h1 className="text-3xl text-[#101828] font-bold  ">Place a bid</h1>
            <p className="text-[#475467] text-sm ">
              Please enter the amount you will like to bid for this item
            </p>
          </div>
          <div className="space-y-4">
            <Image
              src={PorsheImage}
              alt=""
              width={300}
              height={200}
              className="w-full max-h-[200px] h-full rounded-2xl object-cover"
            />
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">2024 PORSHE 911 GT</h1>
              <p className="text-xl font-semibold pb-2">
                Starting price: ₦170,000
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <Input
                label="Your bidding amount"
                placeholder="₦0.00"
                value={amount}
                onChange={handleAmountChange}
                type="text"
                labelClassName="text-sm text-[#182230] font-fixelDisplay"
              />
              <small className="text-[12px] leading-[18px] text-[#182230] font-fixelDisplay">
                Amount should not be less than the reserved price
              </small>
            </div>
            <Button
              className="w-full"
              disabled={isDisabled}
              type="button"
              onClick={handleSubmit}
            >
              Proceed
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-8">
          <div className="space-y-5 flex flex-col items-center text-center">
            <div className="w-full flex justify-center">
              <SuccessCheckIcon />
            </div>
            <div className="text-center space-y-6">
              <h1 className="font-semibold text-2xl text-[#101828]">
                Oh! Something is missing
              </h1>
              <p className="text-sm text-[#475467] font-fixelDisplay">
                We could not find details of your bank account in your profile?
                Kindly provide your bank account details first before placing a
                bid.
              </p>
            </div>
          </div>
          <Button type="button" onClick={handleCloseModal} className="w-full">
            Add Account Details
          </Button>
        </div>
      )}
    </>
  );
}

const enum ProcessBidModalTypes {
  PROCESS_PAYMENT = "PROCESS_PAYMENT",
  BID_RECEIVED = "BID_RECEIVED",
  BID_WON = "BID_WON",
  BID_LOST = "BID_LOST",
  INSUFFICIENT_FUND = "INSUFFICIENT_FUND",
  TOP_UP_DETAILS = "TOP_UP_DETAILS",
  TOP_UP_SUCCESSFUL = "TOP_UP_SUCCESSFUL",
  TOP_UP_FAILED = "TOP_UP_FAILED",
}

function ProcessBidModal({
  setOpenModal,
  defaultProcessBidModalType,
  setDefaultProcessBidModalType,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  defaultProcessBidModalType: ProcessBidModalTypes | null;
  setDefaultProcessBidModalType: React.Dispatch<
    React.SetStateAction<ProcessBidModalTypes | null>
  >;
}) {
  function handleNext(nextStep: ProcessBidModalTypes | null) {
    setDefaultProcessBidModalType(nextStep);
  }
  function handleCloseModal() {
    setOpenModal(false);
    setDefaultProcessBidModalType(null);
  }
  const modalObject = {
    [ProcessBidModalTypes.PROCESS_PAYMENT]: (
      <ProcessingPayment handleNext={handleNext} />
    ),
    [ProcessBidModalTypes.BID_RECEIVED]: (
      <BidReceived handleNext={handleNext} />
    ),
    [ProcessBidModalTypes.BID_WON]: <BidWon />,
    [ProcessBidModalTypes.BID_LOST]: <BidLost />,
    [ProcessBidModalTypes.INSUFFICIENT_FUND]: (
      <InsufficientFund handleNext={handleNext} />
    ),
    [ProcessBidModalTypes.TOP_UP_DETAILS]: (
      <TopUpDetail handleNext={handleNext} />
    ),
    [ProcessBidModalTypes.TOP_UP_SUCCESSFUL]: (
      <TopUpSuccessful handleCloseModal={handleCloseModal} />
    ),
    [ProcessBidModalTypes.TOP_UP_FAILED]: (
      <TopUpFailed handleCloseModal={handleCloseModal} />
    ),
  };
  if (!defaultProcessBidModalType) {
    return null;
  }
  // console.log({ defaultProcessBidModalType });
  return modalObject[defaultProcessBidModalType];
}
function ProcessingPayment({
  handleNext,
}: {
  handleNext(nextStep: ProcessBidModalTypes): void;
}) {
  // set a timeout of 2 seconds to simulate payment processing
  function handleSubmit() {
    handleNext(ProcessBidModalTypes.INSUFFICIENT_FUND); //Received or insufficient fund
  }
  setTimeout(() => {
    // simulate a successful withdrawal or failed withdrawal, randomly
    handleSubmit();
  }, 2000);
  return (
    <div>
      <div className="w-full space-y-6">
        <div className="space-y-5 flex flex-col items-center text-center">
          <SpinnerIcon />
          <p className="text-2xl font-semibold text-[#101828]">
            Processing Payment
          </p>
          <p className="text-sm text-[#475467] font-fixelDisplay">
            Please wait while we process your payment from your wallet. This
            will take a minute.
          </p>
        </div>
      </div>
    </div>
  );
}
function BidReceived({
  handleNext,
}: {
  handleNext(nextStep: ProcessBidModalTypes | null): void;
}) {
  // set a timeout of 2 seconds to simulate payment processing
  function handleSubmit() {
    handleNext(ProcessBidModalTypes.BID_WON);
  }
  function modifyBid() {
    handleNext(null);
  }
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const auctionEndTimeISO = "2024-09-21T16:00:00.000Z";
  useEffect(() => {
    // Parse the ISO format date and calculate the difference between now and auction end time
    const auctionEndTime = new Date(auctionEndTimeISO).getTime();

    // Function to calculate the remaining time
    const calculateTimeLeft = () => {
      const currentTime = new Date().getTime();
      const difference = auctionEndTime - currentTime;
      setTimeLeft(Math.max(difference / 1000, 0)); // Convert to seconds and ensure non-negative
    };

    // Call it immediately to set the initial time left
    calculateTimeLeft();

    // Set interval to update the countdown every second
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    // Clear interval when the component unmounts
    return () => clearInterval(timer);
  }, [auctionEndTimeISO]);

  function handleBidResult() {
    // simulate a successful withdrawal or failed withdrawal, randomly
    // const random = Math.random();
    handleNext(ProcessBidModalTypes.BID_WON);
    // if (random > 0.5)
    // else handleNext(ProcessBidModalTypes.BID_LOST);
  }
  // if the time is up, redirect to the auction page
  if (timeLeft <= 0) {
    handleBidResult();
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-5 flex flex-col items-center text-center">
        <div className="w-full flex justify-center">
          <SuccessCheckIcon />
        </div>
        <div className="text-center space-y-6">
          <h1 className="font-semibold text-2xl text-[#101828]">
            Bid Received
          </h1>
          <p className="text-sm text-[#475467] font-fixelDisplay">
            <span>
              Your bid has been submitted successfully. Winner will be announced
              by close of auction. To modify your bid,{" "}
            </span>
            <span
              className="text-[#F68B36] underline cursor-pointer"
              onClick={modifyBid}
            >
              click here.
            </span>
          </p>
        </div>
      </div>
      <Button type="button" onClick={handleSubmit} className="w-full">
        {formatTime(timeLeft)}
      </Button>
    </div>
  );
}
function BidWon() {
  function handleSubmit() {}
  function viewBid() {}
  return (
    <div className="w-full space-y-8">
      <div className="space-y-5 flex flex-col items-center text-center">
        <div className="w-full flex justify-center">
          <Gravel />
        </div>
        <div className="text-center space-y-6">
          <h1 className="font-semibold text-2xl text-[#101828]">
            Congratulations!
          </h1>
          <p className="text-sm text-[#475467] font-fixelDisplay">
            <p>
              <span>You won the bid for</span>
              <span className="font-bold"> Lot #: 123456789</span>
            </p>
            <p>
              <span>For asset pickup details, </span>
              <span
                className="text-[#F68B36] underline cursor-pointer"
                onClick={viewBid}
              >
                click here.
              </span>
            </p>
          </p>
        </div>
      </div>
      <Button type="button" onClick={handleSubmit} className="w-full">
        00:00:00
      </Button>
    </div>
  );
}
function BidLost() {
  function handleSubmit() {}
  // function viewBid() {}
  return (
    <div className="w-full space-y-8">
      <div className="space-y-5 flex flex-col items-center text-center">
        <div className="w-full flex justify-center">
          <SuccessCheckIcon />
        </div>
        <div className="text-center space-y-6">
          <h1 className="font-semibold text-2xl text-[#101828]">
            Auction Closed
          </h1>
          <p className="text-sm text-[#475467] font-fixelDisplay">
            <p>
              Your bid for <span className="font-bold"> Lot #: 123456789 </span>
              was not a winning bid.
            </p>
            Your bid amount of <span className="font-bold"> ₦170,000</span> has
            been returned to your wallet
          </p>
        </div>
      </div>
      <Button type="button" onClick={handleSubmit} className="w-full">
        00:00:00
      </Button>
    </div>
  );
}
function InsufficientFund({
  handleNext,
}: {
  handleNext(nextStep: ProcessBidModalTypes | null): void;
}) {
  function handleSubmit() {
    handleNext(ProcessBidModalTypes.TOP_UP_DETAILS);
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-5 flex flex-col items-center text-center">
        <div className="w-full flex justify-center">
          <WalletFail />
        </div>
        <div className="text-center space-y-6">
          <h1 className="font-semibold text-2xl text-[#101828]">
            Insufficient funds
          </h1>
          <p className="text-sm text-[#475467] font-fixelDisplay">
            You do not have sufficient funds in your wallet. Please top up your
            wallet to continue
          </p>
        </div>
      </div>
      <div className="bg-[#D9F2EF] rounded-lg space-x-2 p-2 flex  items-center">
        <div>
          <ExclamationCircleIcon className="w-5 h-5 text-[#008774]" />
        </div>
        <div className="text-[#262425] font-medium text-base">
          <p>
            Wallet balance : <span>₦100,000</span>
          </p>
          <p>
            Bid amount: <span>₦170,000</span>
          </p>
        </div>
      </div>
      <Button type="button" onClick={handleSubmit} className="w-full">
        Top Up Account
      </Button>
    </div>
  );
}
function TopUpDetail({
  handleNext,
}: {
  handleNext(nextStep: ProcessBidModalTypes | null): void;
}) {
  function handleSubmit() {
    handleNext(ProcessBidModalTypes.TOP_UP_SUCCESSFUL);
  }

  const [amount, setAmount] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(true);

  function handleAmountChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const inputValue = e.target.value.replace(/[^\d.]/g, ""); // Allow only numbers
    setAmount(formatCurrency(inputValue)); // Format input value
    setIsDisabled(inputValue === "" || parseFloat(inputValue) < 1); // Disable button if input is invalid
  }
  const paymentMethods = [
    {
      icon: ArrowRightIcon,
      value: "Transfer",
    },
    {
      icon: ArrowRightIcon,
      value: "Card",
    },
  ];
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  function handleSelected(name: string) {
    setSelectedMethod(name);
  }
  return (
    <div className="w-full space-y-8 text-[#182230]">
      <h1 className="text-3xl text-[#101828] mb-6 ">Top Up</h1>
      <div className="space-y-6">
        <Input
          label="Amount"
          placeholder="₦0.00"
          value={amount}
          onChange={handleAmountChange}
          type="text"
        />
        <div className="space-y-1">
          <p>Pay With</p>
          <div className="space-y-4">
            {paymentMethods.map((method, id) => {
              const isSelected = selectedMethod === method.value;

              return (
                <div
                  key={id}
                  onClick={() => handleSelected(method.value)}
                  className={classNames(
                    `px-4 py-6 rounded-xl cursor-pointer  flex gap-6 justify-between items-center bg-[#F2F4F7] `,
                    {
                      "border-2 border-[#AC6126]": isSelected,
                      "border-[#EAECF0] border-[0.5px]": !isSelected,
                    }
                  )}
                >
                  <div className="flex space-x-6 items-center text-sm font-fixelDisplay">
                    {isSelected ? (
                      <ArrowsRightLeftIcon className="w-5 h-5 text-[#363435]" />
                    ) : (
                      <ArrowRightIcon className="w-5 h-5 text-[#363435]" />
                    )}
                    <p>{method.value}</p>
                  </div>
                  <div className={classNames("", {})}>
                    <div
                      className={classNames(
                        "w-[14px] h-[14px] rounded-full border-2 flex items-center justify-center",
                        {
                          " border-[#667085]": !isSelected,
                          "border-[#F68B36]": isSelected,
                        }
                      )}
                    >
                      {isSelected && (
                        <div className="w-[6px] h-[6px] bg-[#F68B36] rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Button
        type="button"
        onClick={handleSubmit}
        className="w-full"
        disabled={isDisabled || !selectedMethod}
      >
        Top Up Account
      </Button>
    </div>
  );
}
function TopUpSuccessful({ handleCloseModal }: { handleCloseModal(): void }) {
  return (
    <div className="w-full space-y-8">
      <div className="space-y-5 flex flex-col items-center text-center">
        <Image src={SuccessGif} alt="" className="w-24 h-24" />
        <p className="text-2xl font-semibold text-[#101828]"> {"Nice move"}</p>
        <p className="text-sm text-[#475467]">
          Your wallet Top Up is successful, kindly proceed to place a bid for
          lot
          <span> #123456789</span>
        </p>
      </div>
      <Button type="button" onClick={handleCloseModal} className="w-full">
        Got it
      </Button>
    </div>
  );
}
function TopUpFailed({ handleCloseModal }: { handleCloseModal(): void }) {
  return (
    <div className="w-full space-y-8">
      <div className="space-y-5 flex flex-col items-center text-center">
        <Image src={FailCheckIcon} alt="" className="w-24 h-24" />
        <p className="text-2xl font-semibold text-[#101828]"> {"Failed!"}</p>
        <p className="text-sm text-[#475467]">
          {
            "Sorry, we could not process your top up at this time. Please try again later."
          }
        </p>
      </div>
      <Button type="button" onClick={handleCloseModal} className="w-full">
        Got it
      </Button>
    </div>
  );
}

export default Page;
