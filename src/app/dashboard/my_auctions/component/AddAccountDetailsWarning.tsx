import Button from "../../component/Button";
import { AddAuctionModalTypes } from "@/types";

function AddAccountDetailsWarning({
  handleNextStep,
}: {
  handleNextStep: (nextStep: AddAuctionModalTypes) => void;
}) {
  return (
    <div className="w-full space-y-8">
      <div className="space-y-5 flex flex-col items-center text-center">
        <div className="w-full flex justify-center">
          {/* Your icon component */}
        </div>
        <div className="text-center space-y-6">
          <h1 className="font-semibold text-2xl text-[#101828]">
            Oh! Something is missing
          </h1>
          <p className="text-sm text-[#475467] font-fixelDisplay">
            We could not find details of your bank account in your profile?
            Kindly provide your bank account details first before placing a bid.
          </p>
        </div>
      </div>
      <Button
        type="button"
        onClick={() =>
          handleNextStep(AddAuctionModalTypes.ACCOUNT_ACCOUNT_DETAILS)
        }
        className="w-full"
      >
        Add Account Details
      </Button>
    </div>
  );
}

export default AddAccountDetailsWarning;
