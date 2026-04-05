"use client";
import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";

import Button from "@/components/form/button";
import ReUseModal from "@/components/Modal/ReUseModal";

import SemiCircularProgressBar from "../components/ProgressBar/SemiCircularProgressBar";
import SuccessCheckIcon from "@/assets/icons/SuccessCheckIcon";
import Input from "@/components/form/input";
import Select from "@/components/form/selection";
import { ApiSuccessResponse, Location, VerifyOtpResponse } from "@/types";
import AddressAutocomplete from "@/components/AddressAutoComplete";
import FileService from "../../../api/FileService";
import { useUserStore } from "@/store/useUserStore";
import ImagePicker from "@/app/dashboard/my_auctions/add_auction/component/ImagePicker";
import CompanyService from "@/app/api/CompanyService";
import toast from "react-hot-toast";
import { formatPhoneNumber } from "@/app/helpers/phoneNumber.utils";
import { updateUserProfile } from "../../api/AuthService";
import { useRouter } from "next/navigation";
import GoogleMapsWrapper from "@/components/GoogleMapsWrapper";

// Company Validation Schema (Step 1)
const companyValidationSchema = Yup.object({
  companyName: Yup.string().required("Company name is required"),
  companyAddress: Yup.object().shape({
    placeId: Yup.string().required("Place ID is required"),
    fullAddress: Yup.string().required("Full address is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    coordinates: Yup.object().shape({
      lat: Yup.number().required("Latitude is required"),
      lng: Yup.number().required("Longitude is required"),
    }),
  }),
  companyPhone: Yup.string()
    .matches(/^[0-9]+$/, "Company phone must be digits only")
    .required("Company phone is required"),
  companyEmail: Yup.string()
    .email("Invalid email address")
    .required("Company email is required"),
  companyLogo: Yup.mixed().required("Company logo is required"),
  companyWebsite: Yup.string().required("Company website is required"),
  companyLetterOfAuthorization: Yup.mixed().required("Company LOA is required"),
});

// User Validation Schema (Step 2)
const userValidationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  address: Yup.object().shape({
    placeId: Yup.string().required("Place ID is required"),
    fullAddress: Yup.string().required("Full address is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    coordinates: Yup.object().shape({
      lat: Yup.number().required("Latitude is required"),
      lng: Yup.number().required("Longitude is required"),
    }),
  }),
  dob: Yup.date().required("Date of birth is required"),
  phoneNumber: Yup.string()
    .matches(
      /^(?:\+234|234|0)\d{10}$/,
      "Phone number must be in the format +234XXXXXXXXXX, 234XXXXXXXXXX, or 0XXXXXXXXX"
    )
    .required("Phone number is required"),

  picture: Yup.mixed().required("A picture is required"),
  gender: Yup.string().required("Gender is required"),
});

const CompleteRegistration = () => {
  const [currentStep, setCurrentStep] = useState(2); // Step control
  const [openModal, setOpenModal] = useState(false);
  const { company, user, setCompany, setUser } = useUserStore();
  const router = useRouter();
  // Company formik (Step 1)
  const companyFormik = useFormik({
    initialValues: {
      companyName: "",
      companyAddress: {
        placeId: "",
        fullAddress: "",
        state: "",
        country: "",
        coordinates: { lat: 0, lng: 0 },
      },
      companyPhone: "",
      companyEmail: company?.email || user?.email || "",
      companyLogo: "",
      companyWebsite: "",
      companyLetterOfAuthorization: "",
    },
    validationSchema: companyValidationSchema,
    onSubmit: (values) => {
      console.log("Company Form Submitted:", values);
      CompanyService.UpdateCompanyService({
        name: values.companyName,
        address: values.companyAddress,
        phone: formatPhoneNumber(values.companyPhone),
        email: values.companyEmail,
        website: values.companyWebsite,
        logoUrl: values.companyLogo,
        authorizationLetter: values.companyLetterOfAuthorization,
      }).then((response) => {
        if (response.success) {
          setCompany(response.data.company);
          setCurrentStep(2); // Move to next step
        } else {
          toast.error(response.message, {
            position: "top-center",
          });
        }
      });
    },
    validateOnChange: true, // Enable validation on change
    validateOnBlur: true, // Enable validation on blur
  });

  // User formik (Step 2)
  const userFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: {
        placeId: "",
        fullAddress: "",
        state: "",
        country: "",
        coordinates: { lat: 0, lng: 0 },
      },
      dob: "",
      phoneNumber: "",
      gender: "",
      picture: "",
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      console.log("User Form Submitted:", values);

      const response = (await updateUserProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: formatPhoneNumber(values.phoneNumber),
        imageUrl: values.picture,
        address: {
          placeId: values.address.placeId,
          fullAddress: values.address.fullAddress,
          state: values.address.state,
          country: values.address.country,
          coordinates: values.address.coordinates,
        },
        dob: values.dob,
        gender: values.gender.toUpperCase(),
        // email: values.email,
      })) as ApiSuccessResponse<VerifyOtpResponse>;

      if (response.success) {
        setUser(response.data.user);
        setOpenModal(true);
        userFormik.resetForm(); // Clear formik values
      } else {
        toast.error(response.message, {
          position: "top-center",
        });
      }
    },
  });

  // Handle file upload for company logo and user picture
  const handleCompanyLogoChange = async (file: File | null) => {
    if (file) {
      const res = await FileService.UploadFileService(file, {
        type: "OTHER",
        fileName: `company_logo_${Date.now()}`,
        updateIfExists: true,
      });
      const imageUrl = res.data.url;
      companyFormik.setFieldValue("companyLogo", imageUrl);
    }
  };

  const handleCompanyLetter = async (file: File | null) => {
    if (file) {
      const res = await FileService.UploadFileService(file, {
        type: "OTHER",
        fileName: `company_loa_${Date.now()}`,
        updateIfExists: true,
      });
      const fileUrl = res.data.url;
      companyFormik.setFieldValue("companyLetterOfAuthorization", fileUrl);
    }
  };

  const handleUserPictureChange = async (file: File | null) => {
    if (file) {
      const res = await FileService.UploadFileService(file, {
        type: "PROFILE",
        fileName: `profile_picture_${Date.now()}`,
        updateIfExists: true,
      });
      const imageUrl = res.data.url;
      userFormik.setFieldValue("picture", imageUrl);
    }
  };

  // Handle address selection from AddressAutocomplete for company and user forms
  const handleCompanyAddressSelect = (location: Location) => {
    companyFormik.setFieldValue("companyAddress", {
      placeId: location.placeId,
      fullAddress: location.fullAddress,
      state: location.state,
      country: location.country,
      coordinates: location.coordinates,
    });
  };

  const handleUserAddressSelect = (location: Location) => {
    userFormik.setFieldValue("address", {
      placeId: location.placeId,
      fullAddress: location.fullAddress,
      state: location.state,
      country: location.country,
      coordinates: location.coordinates,
    });
  };

  return (
    <div>
      <div className="w-1/3 mx-auto p-4 pt-[100px]">
        <div className="text-center mb-6">
          <h1 className="font-bold text-3xl text-[#101828]">Welcome!</h1>
          <p className="text-[#475467] text-base">Let&apos;s get you started</p>
        </div>

        <div className="w-full flex justify-center mx-auto">
          <form
            onSubmit={
              currentStep === 1
                ? companyFormik.handleSubmit
                : userFormik.handleSubmit
            }
            className="w-full space-y-4"
          >
            {/* Picture Upload */}
            <div className="flex w-full justify-between items-center">
              <div className="mb-4 flex-shrink-0">
                <label htmlFor="picture" className="text-[#182230]">
                  {currentStep === 1 ? "Company Logo" : "Profile Picture"}
                </label>

                {currentStep === 1 && (
                  <ImagePicker
                    onFileSelect={handleCompanyLogoChange}
                    parentClassName="w-[50%]"
                    acceptedFileTypes={["image/*"]}
                  />
                )}
                {currentStep === 2 && (
                  <ImagePicker
                    onFileSelect={handleUserPictureChange}
                    parentClassName="w-[50%]"
                    acceptedFileTypes={["image/*"]}
                  />
                )}
              </div>
              <div>
                <SemiCircularProgressBar
                  currentStep={currentStep}
                  totalSteps={2}
                />
              </div>
            </div>

            {currentStep === 1 ? (
              // Company Form (Step 1)
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Company Name */}
                <Input
                  type="text"
                  name="companyName"
                  label="Company Name"
                  placeholder="Enter company name"
                  onChange={companyFormik.handleChange}
                  value={companyFormik.values.companyName}
                  parentClassName="col-span-2"
                />

                {/* Company Address */}
                <AddressAutocomplete
                  label="Company Address"
                  onSelectAddress={handleCompanyAddressSelect}
                  error={
                    companyFormik.touched.companyAddress?.fullAddress
                      ? companyFormik.errors.companyAddress?.fullAddress
                      : ""
                  }
                  parentClassName="col-span-2"
                />

                {/* Company Phone */}
                <Input
                  type="text"
                  name="companyPhone"
                  label="Company Phone"
                  parentClassName="col-span-2"
                  placeholder="Enter company phone"
                  onChange={companyFormik.handleChange}
                  value={companyFormik.values.companyPhone}
                />

                {/* Company Email */}
                <Input
                  type="email"
                  name="companyEmail"
                  label="Company Email"
                  placeholder="Enter company email"
                  onChange={companyFormik.handleChange}
                  value={companyFormik.values.companyEmail}
                />
                {/* Company Website */}
                <Input
                  type="text"
                  name="companyWebsite"
                  label="Company Website"
                  placeholder="Enter company website"
                  onChange={companyFormik.handleChange}
                  value={companyFormik.values.companyWebsite}
                />
                <div className="col-span-2">
                  <label htmlFor="picture" className="text-[#182230]">
                    Upload Letter of Authorization
                  </label>

                  <ImagePicker
                    acceptedFileTypes={["image/*", "application/pdf"]}
                    onFileSelect={handleCompanyLetter}
                    // parentClassName="max-w-[300px] min-h-[200px] w-full h-full"
                    parentClassName="w-full h-[200px]"
                  />
                </div>
              </div>
            ) : (
              // User Form (Step 2)
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* First Name */}
                <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  onChange={userFormik.handleChange}
                  value={userFormik.values.firstName}
                />

                {/* Last Name */}
                <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  onChange={userFormik.handleChange}
                  value={userFormik.values.lastName}
                />

                {/* User Address */}
                <AddressAutocomplete
                  label="Address"
                  onSelectAddress={handleUserAddressSelect}
                  error={
                    userFormik.touched.address?.fullAddress
                      ? userFormik.errors.address?.fullAddress
                      : ""
                  }
                  parentClassName="col-span-2"
                />

                {/* Date of Birth */}
                <Input
                  type="date"
                  name="dob"
                  label="Date of Birth"
                  placeholder="Enter your date of birth"
                  onChange={userFormik.handleChange}
                  value={userFormik.values.dob}
                />

                {/* Gender */}
                <Select
                  name="gender"
                  label="Gender"
                  options={[
                    { value: "", label: "Select Gender" },
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  onChange={userFormik.handleChange}
                  value={userFormik.values.gender}
                  className="w-full"
                />

                {/* Phone Number */}
                <Input
                  type="text"
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  onChange={userFormik.handleChange}
                  value={userFormik.values.phoneNumber}
                />

                {/* Email */}
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  onChange={userFormik.handleChange}
                  value={userFormik.values.email}
                  parentClassName="col-span-2"
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              label={currentStep === 1 ? "Next" : "Submit"}
              className="mt-10"
              disabled={
                currentStep === 1
                  ? !(companyFormik.isValid && companyFormik.dirty)
                  : !(userFormik.isValid && userFormik.dirty)
              }
            />
          </form>
        </div>
      </div>

      {/* Modal for success after final submission */}
      <ReUseModal
        open={openModal}
        setOpen={setOpenModal}
        parentClassName="sm:max-w-md w-1/3"
      >
        <div className="flex flex-col justify-center space-y-6">
          <div className="w-full flex justify-center">
            <SuccessCheckIcon />
          </div>
          <div className="text-center space-y-6">
            <h1>Welcome onboard XYZ LTD</h1>
            <p className="text-sm text-[#475467]">
              Your account was created and is under review.
            </p>
          </div>

          <div className="space-y-6 ">
            <Button
              onClick={() => router.push("/dashboard/company")}
              label="Close"
              buttonType="outline"
              className="!text-[#344054] font-semibold text-base !border !border-[#D0D5DD]"
            />
          </div>
        </div>
      </ReUseModal>
    </div>
  );
};

export default function Page() {
  return (
    <GoogleMapsWrapper>
      <CompleteRegistration />
    </GoogleMapsWrapper>
  );
}
