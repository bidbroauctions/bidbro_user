import { useState, useEffect } from "react";
import Button from "../../component/Button";
import OTPInput from "react-otp-input";
import { AddAuctionModalTypes } from "@/types";
import classNames from "classnames";
import { maskEmail } from "@/app/helpers/maskEmail";
import { useDashboardContext } from "../../context/DashboardContext";
import { useUserStore } from "@/store/useUserStore";
import WalletService from "@/app/api/WalletService";

function AddAccountDetailsOTP({
  handleNextStep,
}: {
  handleNextStep: (nextStep: AddAuctionModalTypes) => void;
}) {
  const { newBankAccountDetail } = useDashboardContext();
  const { user } = useUserStore();

  const [otp, setOtp] = useState("");
  const [isOtpBtnDisabled, setIsOtpBtnDisabled] = useState(true);
  useEffect(() => {
    setIsOtpBtnDisabled(otp.length < 6);
  }, [otp]);

  console.log({ newBankAccountDetail });
  function handleSubmit() {
    if (!newBankAccountDetail) return;

    WalletService.AddBankAccountService({
      otp,
      bankCode: newBankAccountDetail.bankCode,
      bankName: newBankAccountDetail.bankName,

      accountName: newBankAccountDetail.accountName,
      accountNumber: newBankAccountDetail.accountNumber,
    }).then((response) => {
      if (response.success) {
        handleNextStep(AddAuctionModalTypes.ACCOUNT_ACCOUNT_DETAILS_SUCCESS);
      }
    });
  }

  return (
    <div className="space-y-6 w-full p-14 pb-20">
      <div className="text-center space-y-2 my-6">
        <h1 className="text-2xl font-normal text-header">Enter One-Time-Pin</h1>
      </div>

      <OTPInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        inputType="number"
        containerStyle={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          width: "100%",
        }}
        inputStyle={{
          width: "50px",
          height: "50px",
          fontSize: "20px",
          textAlign: "center",
        }}
        renderInput={(props) => (
          <input
            {...props}
            className={classNames(
              `w-full border-b-2 border-b-black focus:outline-none focus:border-black focus:border-b-2 focus:ring-none px-3 py-2 text-sm leading-5 text-black`,
              {
                "border-b-0 focus:border-b-0": props.value,
              }
            )}
          />
        )}
      />
      <p className="text-highlight text-base font-normal leading-6 text-center">
        Kindly enter OTP sent to your email ending{" "}
        {maskEmail(user?.email as string)}
      </p>
      <Button
        className="w-full"
        disabled={isOtpBtnDisabled}
        type="button"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </div>
  );
}

export default AddAccountDetailsOTP;
