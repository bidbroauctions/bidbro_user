"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImagePicker from "@/components/form/ImagePicker";
import Input from "@/components/form/input";

const accountUpgradeValidationSchema = Yup.object({
  nin: Yup.string()
    .min(11, "NIN must be exactly 11 digits")
    .max(11, "NIN must be exactly 11 digits")
    .required("NIN is required"),
});

const AccountUpgradePage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);

  const formik = useFormik({
    initialValues: { nin: "" },
    validationSchema: accountUpgradeValidationSchema,
    onSubmit: (values) => {
      console.log(
        "Account upgrade requested with NIN:",
        values.nin,
        "and file:",
        uploadedFile
      );
    },
  });

  const handleFileUpload = (file: File | null) => {
    if (file) setUploadedFile(file);
  };
  const isFormReadyForSubmit = formik.isValid && formik.dirty;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-4">Account upgrade</h1>
        <p className="text-center text-[#475467] mb-8 ">
          Please provide the following requirements to upgrade your account
        </p>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <Input
              label="NIN"
              value={formik.values.nin}
              onChange={formik.handleChange}
              name="nin"
            />
            {formik.touched.nin && formik.errors.nin ? (
              <p className="text-sm text-red-500 mt-2">{formik.errors.nin}</p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Dial *996# on your phone to get your NIN
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="upload"
            >
              Upload NIN
            </label>
            <ImagePicker
              onFileSelect={handleFileUpload}
              acceptedFileTypes={["image/*", "application/pdf"]}
            />
          </div>

          <button
            type="submit"
            disabled={!isFormReadyForSubmit}
            className={`w-full py-3 rounded-md font-bold mb-4  text-white ${
              isFormReadyForSubmit
                ? "bg-[#F68B36] "
                : "bg-[#F2C390]  cursor-not-allowed"
            }`}
          >
            Upgrade account
          </button>
          <button
            type="button"
            className="w-full border border-gray-300 py-3 rounded-md text-gray-700 font-bold"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountUpgradePage;
