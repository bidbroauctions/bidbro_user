"use client";
import * as Yup from "yup";
import Input from "@/components/form/input";
import { useFormik } from "formik";
import { AddAuctionModalTypes, AddBankAccountModalTypes } from "@/types";
import Button from "../../component/Button";
import { BankRecord } from "@/types"; // Ensure the correct import of BankRecord
import { useEffect, useState } from "react";
import WalletService from "@/app/api/WalletService";
import { useDashboardContext } from "../../context/DashboardContext";
import { initiateOTP } from "@/app/auth/api/AuthService";

function AddAccountDetails({
  handleNextStep,
}: {
  handleNextStep: (
    nextStep: AddAuctionModalTypes | AddBankAccountModalTypes
  ) => void;
}) {
  const { setNewBankAccountDetail } = useDashboardContext();
  // Validation schema for formik
  const accountDetailsValidationSchema = Yup.object().shape({
    bankAccountNumber: Yup.string().required("Bank account number is required"),
    accountName: Yup.string().required("Account name is required"),
    selectedBank: Yup.object()
      .shape({
        id: Yup.number().required("Bank selection is required"),
        name: Yup.string().required("Bank name is required"),
        code: Yup.string().required("Bank code is required"),
      })
      .required("Bank selection is required"),
  });

  // State for bank-related data
  const [banks, setBanks] = useState<BankRecord[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<BankRecord[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetching banks list from the WalletService
  useEffect(() => {
    WalletService.FetchBankService().then((response) => {
      if (response.success) {
        setBanks(response.data.records);
      }
    });
  }, []);

  // Formik setup with selectedBank to store all related data for the selected bank
  const formik = useFormik({
    initialValues: {
      bankAccountNumber: "",
      accountName: "",
      selectedBank: {
        id: 0,
        name: "",
        code: "",
      },
    },
    validationSchema: accountDetailsValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      initiateOTP("BANK_ACCOUNT_CREATION").then((response) => {
        if (!response.success) {
          return;
        }
        setNewBankAccountDetail({
          accountName: values.accountName,
          bankCode: values.selectedBank.code,
          accountNumber: values.bankAccountNumber,
          bankId: values.selectedBank.id,
          resolved: true,
          bankName: values.selectedBank.name,
        });

        // Store the new bank account details in the context
        // Proceed to the next step on successful validation
        handleNextStep(AddAuctionModalTypes.ACCOUNT_ACCOUNT_DETAILS_OTP);
      });
    },
  });

  // Handle bank name input and filter suggestions
  const handleBankNameChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value;
    formik.setFieldValue("selectedBank", {
      ...formik.values.selectedBank,
      name: inputValue,
    });

    // Filter the banks based on the user input
    if (inputValue.length > 0) {
      const suggestions = banks.filter((bank) =>
        bank.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredBanks(suggestions);
      setShowSuggestions(true);
    } else {
      setFilteredBanks([]);
      setShowSuggestions(false);
    }
  };

  // Handle selecting a bank from suggestions
  const handleSelectBank = (bank: BankRecord) => {
    formik.setFieldValue("selectedBank", bank); // Store full bank details
    setShowSuggestions(false); // Hide suggestions after selecting
  };

  // Form fields configuration
  const formFields = [
    {
      name: "bankAccountNumber",
      label: "Bank Account Number",
      placeholder: "0123456789",
    },
    {
      name: "accountName",
      label: "Account Name",
      placeholder: "Account Name",
      isDisabled: true,
    },
  ];
  // Resolve bank account details once a valid account number and selected bank are provided
  useEffect(() => {
    const { bankAccountNumber, selectedBank } = formik.values;

    if (bankAccountNumber.length === 10 && selectedBank.code) {
      WalletService.ResolveBankAccountService({
        bankCode: selectedBank.code,
        accountNumber: bankAccountNumber,
      }).then((response) => {
        if (response.success) {
          formik.setFieldValue("accountName", response.data.accountName); // Set the resolved account name
        } else {
          formik.setFieldError(
            "bankAccountNumber",
            "Failed to resolve account"
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.bankAccountNumber, formik.values.selectedBank]);

  return (
    <div className="w-full text-[#101828]">
      <div className="mb-6">
        <h1 className="text-3xl text-[#101828] font-bold">Add Account</h1>
      </div>

      {/* Wrapping form with <form> element to use formik's onSubmit */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {/* Bank Name with Auto-Suggest */}
          <div className="relative">
            <Input
              name="bankName"
              label="Bank Name"
              placeholder="Bank Name"
              value={formik.values.selectedBank?.name || ""}
              onChange={handleBankNameChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched?.selectedBank?.name &&
                formik.errors?.selectedBank?.name
                  ? formik.errors.selectedBank.name
                  : undefined
              }
            />
            {/* Auto-suggest dropdown */}
            {showSuggestions && filteredBanks.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredBanks.map((bank) => (
                  <li
                    key={bank.code}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                    onClick={() => handleSelectBank(bank)}
                  >
                    {bank.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Render other input fields */}
          {formFields.map((field, index) => (
            <Input
              key={index}
              name={field.name}
              label={field.label}
              placeholder={field.placeholder}
              disabled={field.isDisabled}
              value={
                formik.values[
                  field.name as keyof {
                    bankAccountNumber: string;
                    accountName: string;
                  }
                ] ?? ""
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched[field.name as keyof typeof formik.touched] &&
                typeof formik.errors[
                  field.name as keyof typeof formik.errors
                ] === "string"
                  ? (formik.errors[
                      field.name as keyof typeof formik.errors
                    ] as string)
                  : undefined
              }
            />
          ))}
        </div>

        {/* Submit Button */}
        <Button
          className="w-full"
          disabled={!(formik.isValid && formik.dirty)}
          type="submit"
        >
          Proceed
        </Button>
      </form>
    </div>
  );
}

export default AddAccountDetails;
