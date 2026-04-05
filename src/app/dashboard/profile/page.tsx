"use client";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import React, { useState } from "react";
import ProfileImage from "@/assets/images/profile.png";
import SuccessCheckIcon from "@/assets/icons/SuccessCheckIcon";
import { useDashboardContext } from "../context/DashboardContext";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import ReUseModal from "@/components/Modal/ReUseModal";
import { useRouter } from "next/navigation";

import AddAccountDetailsOTP from "../my_auctions/component/AddAccountDetailsOTP";
import AddAccountDetailsSuccess from "../my_auctions/component/AddAccountDetailsSuccess";
import AddAccountDetails from "../my_auctions/component/AddBankDetails";
import { AddAuctionModalTypes, AddBankAccountModalTypes } from "@/types";
import Link from "next/link";

const Page = () => {
  const { company, user } = useUserStore();
  const { bankAccountDetails } = useDashboardContext();
  const isCompanyAccount = company?.id;
  const bankAccount = bankAccountDetails[0];

  // Define the right section data as a list
  const userDetails = [
    { label: "Email", value: user?.email },
    {
      label: "State/Country",
      value: `${user?.address.state}/${user?.address.country}`,
    },
    { label: "Address", value: user?.address.fullAddress },
    { label: "Zip code/postcode", value: user?.address.placeId },
    { label: "Phone", value: user?.phone },
    { label: "Account Name", value: bankAccount?.accountName },
    { label: "Account Number", value: bankAccount?.accountNumber },
    { label: "Bank", value: bankAccount?.bankName },
    // Uncomment if NIN is needed
    // { label: "NIN", value: user?.nin },
  ];

  // Group userDetails into pairs of two
  const pairedUserDetails = [];
  for (let i = 0; i < userDetails.length; i += 2) {
    pairedUserDetails.push(userDetails.slice(i, i + 2));
  }
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<AddBankAccountModalTypes | null>(
    null
  );

  function openAccountDetailsModal() {
    setModalType(AddBankAccountModalTypes.ACCOUNT_ACCOUNT_DETAILS);
    setOpenModal(true);
  }
  return (
    <div className="p-4">
      {/* Notification */}
      <div className="w-full flex justify-end font-sans mb-4">
        <div className="bg-[#D9F2EF] p-2 rounded-lg space-x-6 flex items-center pr-10">
          <SuccessCheckIcon className="w-6 h-6" />
          <p className="text-[#262425] text-base font-bold">
            You are a Level 2 user
          </p>
          <p className="text-[#006557] text-sm font-bold">Account Updated</p>
        </div>
      </div>
      <div className="space-y-10">
        <div
          style={{ boxShadow: "0px 0px 1px 0px #00000066" }}
          className="bg-white py-8 px-6 rounded-lg flex space-x-8"
        >
          {/* Left Section */}
          <div className="flex-[0.35] border-r border-r-[#D4D5D7] space-y-8 flex justify-center items-center flex-col">
            <Image
              src={
                isCompanyAccount
                  ? company?.logoUrl ?? ProfileImage
                  : user?.imageUrl ?? ProfileImage
              }
              alt="Profile Image"
              width={225}
              height={225}
              className="rounded-full w-[225px] h-[225px] mx-auto"
            />
            <div className="space-y-3 text-center">
              <p className="font-bold text-3xl text-[#1B1F24]">
                {user?.firstName} {user?.lastName} (
                {user?.gender?.[0]?.toLowerCase()})
              </p>
              <Link
                href={"/account-upgrade/"}
                className="bg-[#D9F2EF] py-1 px-2 rounded-2xl inline-block"
              >
                <span className="text-xs text-[#006557] font-medium">
                  User Account - Level 2
                </span>
              </Link>
              <p className="text-[#292F36] font-normal text-xl">
                User ID: <span>{user?.id}</span>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-[0.65] space-y-4 flex flex-col justify-center">
            <div className="space-y-8">
              {pairedUserDetails.map((pair, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-b-[#707479] pb-4 space-y-4"
                >
                  {pair.map((detail, subIndex) => (
                    <div key={subIndex} className="flex-1 space-y-4">
                      <p className="text-sm font-medium text-[#707479]">
                        {detail.label}
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                  {pair.length === 1 && <div className="flex-1"></div>}{" "}
                  {/* Empty space if only one item */}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-[#D4D5D7] border bg-white rounded-lg p-4 flex justify-between items-center">
          <div className="space-y-2">
            <div className="space-x-2 flex items-center font-sans font-semibold text-[#292F36]">
              <LockClosedIcon className="w-6 h-6 text-current" />{" "}
              <span>Reset Account</span>
            </div>
            <div
              className="text-[#FF8931] text-sm underline cursor-pointer"
              onClick={openAccountDetailsModal}
            >
              Click here to securely update your bank account details.
            </div>
          </div>
          <div>
            <button className="bg-[#FFE7D6] text-[#FF8931] px-10 py-5 rounded-lg text-sm font-bold min-w-[200px]">
              <p>Delete Account</p>
            </button>
          </div>
        </div>
      </div>
      <ReUseModal
        open={openModal}
        setOpen={setOpenModal}
        parentClassName="sm:max-w-xl w-full"
        addCloseIcon={true}
      >
        <AddBankAccountModal
          setOpenModal={setOpenModal}
          defaultModalType={modalType}
          setDefaultModalType={setModalType}
        />
      </ReUseModal>
    </div>
  );
};

function AddBankAccountModal({
  setOpenModal,
  defaultModalType,
  setDefaultModalType,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  defaultModalType: AddBankAccountModalTypes | null;
  setDefaultModalType: React.Dispatch<
    React.SetStateAction<AddBankAccountModalTypes | null>
  >;
}) {
  const [modalType, setModalType] = useState(defaultModalType);
  const router = useRouter();
  function handleCloseModal() {
    router.push("?");
    setOpenModal(false);
  }
  function handleNextStep(nextStep: AddBankAccountModalTypes) {
    setModalType(nextStep);
    setDefaultModalType(nextStep);
    router.push(`?action=${nextStep}`);
  }
  const modalsWithTypes = {
    [AddBankAccountModalTypes.ACCOUNT_ACCOUNT_DETAILS]: (
      <AddAccountDetails
        handleNextStep={(
          nextStep: AddAuctionModalTypes | AddBankAccountModalTypes
        ) => handleNextStep(nextStep as AddBankAccountModalTypes)}
      />
    ),
    [AddBankAccountModalTypes.ACCOUNT_ACCOUNT_DETAILS_OTP]: (
      <AddAccountDetailsOTP
        handleNextStep={(
          nextStep: AddAuctionModalTypes | AddBankAccountModalTypes
        ) => handleNextStep(nextStep as AddBankAccountModalTypes)}
      />
    ),
    [AddBankAccountModalTypes.ACCOUNT_ACCOUNT_DETAILS_SUCCESS]: (
      <AddAccountDetailsSuccess handleCloseModal={handleCloseModal} />
    ),
  };
  return <div>{modalType ? modalsWithTypes[modalType] : null}</div>;
}
export default Page;
