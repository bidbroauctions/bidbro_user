import Image from "next/image";
import SuccessGif from "@/assets/images/success.gif";
import Button from "../../component/Button";

function AddAccountDetailsSuccess({
  handleCloseModal,
}: {
  handleCloseModal: () => void;
}) {
  return (
    <div className="w-full space-y-8">
      <div className="space-y-5 flex flex-col items-center text-center">
        <Image src={SuccessGif} alt="" className="w-24 h-24" />
        <p className="text-2xl font-semibold text-[#101828]">Nice move</p>
        <p className="text-sm text-[#475467]">
          Your bank account has been added successfully.
        </p>
      </div>
      <Button type="button" className="w-full" onClick={handleCloseModal}>
        Got it
      </Button>
    </div>
  );
}

export default AddAccountDetailsSuccess;
