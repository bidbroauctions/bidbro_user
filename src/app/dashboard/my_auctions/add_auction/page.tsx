"use client";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import SemiCircularProgressBar from "@/app/auth/complete_registration/components/ProgressBar/SemiCircularProgressBar";
import AuctionDetailsForm from "./component/StepOne";
import { StepTwoForm } from "./component/StepTwo";
import ReUseModal from "@/components/Modal/ReUseModal";
import { useAppContext } from "@/context/AppContext";
import Button from "../../component/Button";
import classNames from "classnames";

import SuccessGif from "@/assets/images/success.gif";
import Image from "next/image";
import { toPng } from "html-to-image";
import {
  ChevronLeftIcon as ChevronLeftIconSolid,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import QrCode from "@/app/helpers/QrCode";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import FaceBook from "@/assets/icons/facebook";
import Twitter from "@/assets/icons/Twitter";
import PorsheImage from "@/assets/images/auction/porshe.jpeg"; // Example image placeholder

import Instagram from "@/assets/icons/Instagram";
import LinkedIn from "@/assets/icons/LinkedIn";
import AddAccountDetails from "../component/AddBankDetails";
import AddAccountDetailsWarning from "../component/AddAccountDetailsWarning";
import AddAccountDetailsOTP from "../component/AddAccountDetailsOTP";
import AddAccountDetailsSuccess from "../component/AddAccountDetailsSuccess";
import { useDashboardContext } from "../../context/DashboardContext";
import WalletService from "@/app/api/WalletService";
import AuctionService from "@/app/api/AuctionService";
import {
  AddAuctionModalTypes,
  AddBankAccountModalTypes,
  Auction,
  FileUploadResponse,
} from "@/types";
import toast from "react-hot-toast";
import { getHostUrl } from "@/app/lib/location";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      return;
    }

    router.back();
  };
  const [currentStep, setCurrentStep] = useState(1);
  const { isModal, setModal } = useAppContext();
  const [modalType, setModalType] = useState<AddAuctionModalTypes | null>(null);
  useEffect(() => {
    // Check if the searchParams include an "action"
    if (searchParams.has("action")) {
      const action = searchParams.get("action");

      // Call the appropriate function based on the "action" value in searchParams
      if (action && actions[action]) {
        actions[action]();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // The effect will re-run whenever searchParams change

  // Function to initialize the modal with the passed action type
  function init(action: AddAuctionModalTypes) {
    setModal(true); // Open modal
    setModalType(action); // Set the type for the modal
  }

  // Mapping action parameter values to corresponding modal types
  const actions: { [key: string]: () => void } = {
    ACCOUNT_ACCOUNT_DETAILS_WARNING: () =>
      init(AddAuctionModalTypes.ACCOUNT_ACCOUNT_DETAILS_WARNING),
    ACCOUNT_ACCOUNT_DETAILS: () =>
      init(AddAuctionModalTypes.ACCOUNT_ACCOUNT_DETAILS),
    ACCOUNT_ACCOUNT_DETAILS_OTP: () =>
      init(AddAuctionModalTypes.ACCOUNT_ACCOUNT_DETAILS_OTP),
    ACCOUNT_ACCOUNT_DETAILS_SUCCESS: () =>
      init(AddAuctionModalTypes.ACCOUNT_ACCOUNT_DETAILS_SUCCESS),
    ADD_AUCTION_CONFIRMATION: () =>
      init(AddAuctionModalTypes.ADD_AUCTION_CONFIRMATION),
    ADD_AUCTION_SUCCESS: () => init(AddAuctionModalTypes.ADD_AUCTION_SUCCESS),
  };

  const { bankAccountDetails, setBankAccountDetails } = useDashboardContext();
  useEffect(() => {
    // Only trigger the modal if no bank account is available
    if (bankAccountDetails.length === 0) {
      // Fetch bank account details
      WalletService.FetchAllAccountsService({})
        .then((response) => {
          if (response.success && response.data.records.length > 0) {
            setBankAccountDetails(response.data.records);
          } else {
            // If no records, open warning modal
            router.push("?action=ACCOUNT_ACCOUNT_DETAILS_WARNING");
          }
        })
        .catch(() => {
          // Handle potential errors in fetching bank accounts
          router.push("?action=ACCOUNT_ACCOUNT_DETAILS_WARNING");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOpenAddAuctionModal() {
    router.push("?action=ADD_AUCTION_CONFIRMATION");
  }

  return (
    <>
      <div className="space-y-6 text-[#101828] bg-white pr-[80px] h-full">
        <div
          onClick={goBack}
          className="flex cursor-pointer w-full space-x-4 items-center px-6 py-4 border-b border-b-[#EBEBEB] text-[#101828] text-base font-semibold"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#363435] cursor-pointer" />
          <p>Back</p>
        </div>

        {/* Add Auction Container */}
        <div className="px-6">
          <div className="flex w-full items-center justify-between">
            <div className="space-y-2">
              <h1 className="font-semibold text-2xl">Add item for auction</h1>
              <p className="font-normal text-sm">
                {currentStep === 1
                  ? "Please provide the following information to continue"
                  : "Upload pictures and a live functioning video"}
              </p>
            </div>
            <div>
              <SemiCircularProgressBar
                currentStep={currentStep}
                totalSteps={2}
              />
            </div>
          </div>

          {currentStep === 1 ? (
            <AuctionDetailsForm setCurrentStep={setCurrentStep} />
          ) : (
            <StepTwoForm
              setCurrentStep={setCurrentStep}
              handleOpenAddAuctionModal={handleOpenAddAuctionModal}
            />
          )}
        </div>
      </div>
      <ReUseModal
        open={isModal}
        setOpen={setModal}
        parentClassName={classNames("sm:max-w-xl w-full", {
          "sm:max-w-3xl":
            modalType === AddAuctionModalTypes.ADD_AUCTION_CONFIRMATION,
        })}
        addCloseIcon
      >
        <AddAuctionModal
          setOpenModal={setModal}
          defaultModalType={modalType as AddAuctionModalTypes}
          setDefaultModalType={setModalType}
        />
      </ReUseModal>
    </>
  );
};

function AddAuctionModal({
  setOpenModal,
  defaultModalType,
  setDefaultModalType,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  defaultModalType: AddAuctionModalTypes;
  setDefaultModalType: React.Dispatch<
    React.SetStateAction<AddAuctionModalTypes | null>
  >;
}) {
  const [modalType, setModalType] = useState(defaultModalType);
  const router = useRouter();
  function handleCloseModal() {
    router.push("?");
    setOpenModal(false);
  }
  function handleNextStep(nextStep: AddAuctionModalTypes) {
    setModalType(nextStep);
    setDefaultModalType(nextStep);
    router.push(`?action=${nextStep}`);
  }
  const modalsWithTypes = {
    [AddAuctionModalTypes.ACCOUNT_ACCOUNT_DETAILS_WARNING]: (
      <AddAccountDetailsWarning handleNextStep={handleNextStep} />
    ),
    [AddAuctionModalTypes.ACCOUNT_ACCOUNT_DETAILS]: (
      <AddAccountDetails
        handleNextStep={(
          nextStep: AddAuctionModalTypes | AddBankAccountModalTypes
        ) => handleNextStep(nextStep as AddAuctionModalTypes)}
      />
    ),
    [AddAuctionModalTypes.ACCOUNT_ACCOUNT_DETAILS_OTP]: (
      <AddAccountDetailsOTP handleNextStep={handleNextStep} />
    ),
    [AddAuctionModalTypes.ACCOUNT_ACCOUNT_DETAILS_SUCCESS]: (
      <AddAccountDetailsSuccess handleCloseModal={handleCloseModal} />
    ),
    [AddAuctionModalTypes.ADD_AUCTION_CONFIRMATION]: (
      <AddAuctionConfirmation
        handleNextStep={handleNextStep}
        handleCloseModal={handleCloseModal}
      />
    ),
    [AddAuctionModalTypes.ADD_AUCTION_SUCCESS]: (
      <AddAuctionSuccess handleCloseModal={handleCloseModal} />
    ),
  };
  return <div>{modalsWithTypes[modalType]}</div>;
}

function AddAuctionConfirmation({
  handleNextStep,
  handleCloseModal,
}: {
  handleNextStep: (nextStep: AddAuctionModalTypes) => void;
  handleCloseModal(): void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Handle navigation to the previous image
  const handlePrev = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const { addNewAuction, setAddNewAuction } = useDashboardContext();
  const router = useRouter();

  useEffect(() => {
    if (!addNewAuction) {
      handleCloseModal();
      router.push("?");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNewAuction, router]);
  const images =
    (addNewAuction?.media
      ?.filter(
        (file) => !!file.url && file.type?.toLocaleLowerCase().includes("image")
      )
      .map((file) => file.url) as string[]) || [];
  function handleSubmit() {
    const newAuction = addNewAuction as Auction;
    AuctionService.CreateAuctionItemService({
      categoryId: newAuction.category?.id,
      make: newAuction.make,
      model: newAuction.model,
      description: newAuction.description,
      yearOfManufacture: newAuction.yearOfManufacture,
      yearOfPurchase: newAuction.yearOfPurchase,
      purchaseStatus: newAuction.purchaseStatus,
      functional: newAuction.functional,
      currency: newAuction.currency,
      reservedPrice: newAuction.reservedPrice,
      buyNowPrice: newAuction.buyNowPrice,
      bidStartDate: newAuction.bidStartDate,
      bidEndDate: newAuction.bidEndDate,
      displayStartAmount: newAuction?.displayStartAmount,
      location: newAuction.location,
      media: newAuction.media.filter(
        (file) => !!file.url
      ) as FileUploadResponse[],
    }).then((res) => {
      if (res.success) {
        console.log("Auction Item Created:", res.data);
        setAddNewAuction(res.data);
        handleNextStep(AddAuctionModalTypes.ADD_AUCTION_SUCCESS);
      } else {
        toast.error(res.message, { position: "top-center" });
      }
    });
  }

  // Handle navigation to the next image
  const handleNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  return (
    <div className="w-full space-y-6">
      <div className="">
        <h1 className="text-3xl text-[#101828] font-bold  ">
          Add item for auction
        </h1>
        <p className="text-[#475467] text-sm mt-6">
          Please confirm your auction summary below.
        </p>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <Image
            src={images[currentIndex]}
            width={1000}
            height={500}
            alt={"auction image"}
            className=" w-full max-h-[500px] min-h-[350px] h-full rounded-2xl object-cover"
          />

          {/* Arrows */}
          <div>
            <div
              onClick={handlePrev}
              className="absolute cursor-pointer top-1/2 left-6  transform  -translate-y-1/2 bg-white p-2 flex items-center justify-center w-fit rounded-full shadow-lg"
            >
              <ChevronLeftIconSolid className="w-5 h-5 text-[#363435]" />
            </div>
            <div
              onClick={handleNext}
              className="absolute cursor-pointer top-1/2 right-6  transform  -translate-y-1/2 bg-white p-2 flex items-center justify-center w-fit rounded-full shadow-lg"
            >
              <ChevronRightIcon className="w-5 h-5 text-[#363435]" />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            2{addNewAuction?.make + " " + addNewAuction?.model}
          </h1>
          <div className="space-y-2">
            <div className="space-y-1 text-lg font-semibold">
              <p className="">
                Starting ₦{addNewAuction?.reservedPrice?.toLocaleString()}
              </p>
              <p className="">
                {" "}
                Reserved: ₦{addNewAuction?.reservedPrice?.toLocaleString()}
              </p>
              <p className="">
                Buy Now: ₦{addNewAuction?.buyNowPrice?.toLocaleString()}
              </p>
            </div>
            <div className="text-xs font-fixelDisplay font-normal text-[#182230] space-y-1">
              <p className="">
                The starting and buy now amount includes a 10% bid premium
                chargeable to the bid winner.
              </p>
              <p className="">
                By clicking confirm below, you agree to our auction terms,
                including payment of 5% Seller Commission to Bidbro chargeable
                on your gross auction earning.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Button type="button" className="w-full" onClick={handleSubmit}>
        Got it
      </Button>
    </div>
  );
}

function AddAuctionSuccess({ handleCloseModal }: { handleCloseModal(): void }) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addNewAuction } = useDashboardContext();
  useEffect(() => {
    if (!addNewAuction) {
      handleCloseModal();
      router.push("?");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNewAuction, router]);
  const handleDownloadBanner = async () => {
    if (bannerRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(bannerRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "auction-banner.png";
      link.click();
    } catch (error) {
      console.error("Error generating image", error);
    }
  };
  const images =
    (addNewAuction?.media
      ?.filter(
        (file) => !!file.url && file.type?.toLocaleLowerCase().includes("image")
      )
      .map((file) => file.url) as string[]) || [];
  const [host, setHost] = useState("");
  getHostUrl().then((url) => {
    setHost(url);
  });
  const url = `${host}/auction/${addNewAuction?.id}`;

  return (
    <div className="w-full space-y-8">
      <div className="space-y-5 flex flex-col items-center text-center">
        <div className="w-full flex justify-center">
          <Image src={SuccessGif} alt="" className="w-24 h-24" />
        </div>
        <p className="text-2xl font-semibold text-[#101828]">Success</p>
        <p className="text-sm text-[#475467]">
          Your auction has been scheduled. Get the best deal by inviting your
          networks to bid.
        </p>
      </div>

      {/* Banner Section */}
      <div className="flex w-full justify-center flex-col items-center">
        <div
          ref={bannerRef}
          className="p-6 rounded-t-2xl bg-[#F2F4F7] space-y-8"
        >
          <div className="flex">
            <div className="w-full text-[#363435] flex flex-col space-y-6">
              <h1 className="text-2xl font-bold">
                {addNewAuction?.make + " " + addNewAuction?.model}
              </h1>
              <div className="text-[#475467] text-base font-fixelDisplay">
                <p>Feb. 14 - 19, 2024</p>
                <p>
                  Starting:{" "}
                  <span>₦{addNewAuction?.reservedPrice?.toLocaleString()}</span>
                </p>
                <p>
                  Buy now:{" "}
                  <span>₦{addNewAuction?.buyNowPrice?.toLocaleString()}</span>
                </p>
              </div>
            </div>
            <div className="w-full h-full">
              <Image
                src={images?.[0] || PorsheImage}
                width={500}
                height={500}
                alt=""
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="flex w-full justify-between space-x-10">
            <div className="text-[#F68B36] flex w-full space-x-6 items-center">
              <div>
                <p className="text-[#101828] text-xl font-medium">
                  Want to be the owner?
                </p>
                <p className="font-bold text-2xl">Scan the QR code</p>
              </div>
              <div>
                <ArrowLongRightIcon className="w-14 text-current" />
              </div>
            </div>
            <div className="">
              <QrCode size={120} url={url} bgColor="#F2F4F7" />
            </div>
          </div>
        </div>
        <div className="bg-[#D0D5DD] flex items-center w-full py-2 justify-center text-center rounded-b-2xl">
          <p className="text-lg font-normal">
            Or visit <span className="font-medium">{url}</span> to place a bid
          </p>
        </div>
      </div>

      {/* Download Banner Button */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center w-full space-x-4">
          <p>Share:</p>
          <div className="flex space-x-4 items-center">
            <FaceBook />
            <Twitter />
            <Instagram />
            <LinkedIn />
          </div>
        </div>
        <div
          className="cursor-pointer flex justify-center items-center w-full rounded-lg border border-[#D0D5DD] bg-white px-4 py-3"
          style={{
            boxShadow: "0px 1px 2px 0px #1018280D",
          }}
          onClick={handleDownloadBanner}
        >
          <span className="cursor-pointer text-[#344054] text-base font-fixelDisplay font-semibold">
            Download Banner
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AddAuctionPage() {
  return <Suspense fallback={<div>Loading...</div>}>{<Page />}</Suspense>;
}
