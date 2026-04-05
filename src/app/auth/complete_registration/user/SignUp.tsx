"use client";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import ImagePicker from "@/components/form/ImagePicker";
import Button from "@/components/form/button";
import Select from "../../../../components/form/selection";
import ReUseModal from "@/components/Modal/ReUseModal";
import Image from "next/image";
import SuccessGif from "@/assets/images/success.gif";
import BxsInfoCircle from "@/assets/icons/BxsInfoCircle";
import Input from "@/components/form/input";
import { useUserStore } from "@/store/useUserStore";
import { updateUserProfile } from "../../api/AuthService";
import { formatPhoneNumber } from "@/app/helpers/phoneNumber.utils";
import { ApiSuccessResponse, Location, VerifyOtpResponse } from "@/types";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

import AddressAutocomplete from "@/components/AddressAutoComplete";
import FileService from "@/app/api/FileService";
import GoogleMapsWrapper from "@/components/GoogleMapsWrapper";

// Define validation schema
const validationSchema = Yup.object({
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
    .required("Phone number is required")
    .matches(
      /^(?:\+234|234|0)?[789]\d{9}$/,
      "Phone number is invalid. Must be a valid Nigerian number"
    ),
  picture: Yup.mixed().required("A picture is required"),
  gender: Yup.string().required("Gender is required"),
});

const SignUp = () => {
  const { user, setUser } = useUserStore();
  const { isLoading, setLoading } = useAppContext();
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",

      dob: "",
      phoneNumber: "",
      gender: "",
      picture: "",
      address: {
        placeId: "",
        fullAddress: "",
        state: "",
        country: "",
        coordinates: { lat: 0, lng: 0 },
      },
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

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
        gender: values.gender,
      })) as ApiSuccessResponse<VerifyOtpResponse>;

      setLoading(false);

      if (response.success) {
        setUser(response.data.user);
        setOpenModal(true);
        formik.resetForm(); // Clear formik values
        router.push("/dashboard/user");
      }
    },
  });
  useEffect(() => {
    // Check if the value is different before updating to avoid unnecessary re-renders
    if (user?.email && formik.values.email !== user.email) {
      formik.setFieldValue("email", user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]); // Use only user.email as a dependency to avoid re-runs

  // Handling file input change for picture upload
  const handlePictureChange = async (file: File | null) => {
    if (file) {
      const res = await FileService.UploadFileService(file, {
        type: "PROFILE",
        fileName: `picture_${user?.id}`,
        updateIfExists: true,
      });
      const imageUrl = res.data.url;
      formik.setFieldValue("picture", imageUrl);
    }
  };

  // Handle address selection from AddressAutocomplete
  const handleAddressSelect = (location: Location) => {
    formik.setFieldValue("address", {
      placeId: location.placeId,
      fullAddress: location.fullAddress,
      state: location.state,
      country: location.country,
      coordinates: location.coordinates,
    });
  };

  function handleDoThisLater() {
    router.push("/dashboard/user");
  }

  return (
    <div>
      <div className="w-1/3 mx-auto p-4 pt-[100px]">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-[#101828]">Welcome!</h1>
          <p className="text-[#475467] text-base">Let&apos;s get you started</p>
        </div>
        <div className="w-full flex justify-center mx-auto">
          <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
            {/* Picture Upload */}
            <div className="mb-4">
              <label htmlFor="picture" className="text-[#182230]">
                Picture
              </label>
              <ImagePicker
                onFileSelect={handlePictureChange}
                parentClassName="w-1/3"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* First Name */}
              <Input
                type="text"
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
                onChange={formik.handleChange}
                value={formik.values.firstName}
              />

              {/* Last Name */}
              <Input
                type="text"
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
                onChange={formik.handleChange}
                value={formik.values.lastName}
              />

              {/* Address */}
              <div className="col-span-2">
                <AddressAutocomplete
                  onSelectAddress={handleAddressSelect}
                  label="Address"
                  error={
                    formik.touched.address?.fullAddress
                      ? formik.errors.address?.fullAddress
                      : ""
                  }
                  parentClassName="w-full col-span-2"
                  labelClassName="text-[#182230]"
                />
              </div>

              {/* Date of Birth */}
              <Input
                type="date"
                name="dob"
                label="Date of Birth"
                placeholder="Enter your date of birth"
                onChange={formik.handleChange}
                value={formik.values.dob}
              />

              {/* Gender Select */}
              <Select
                name="gender"
                label="Gender"
                options={[
                  { value: "", label: "Select Gender" },
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                ]}
                onChange={formik.handleChange}
                value={formik.values.gender}
              />

              {/* Email */}
              <Input
                type="email"
                name="email"
                label="Email"
                placeholder="Enter your email"
                onChange={formik.handleChange}
                value={formik.values.email}
                parentClassName="col-span-2"
              />
              {/* Phone Number */}
              <Input
                type="text"
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter your phone number"
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              label="Next"
              className="!mt-10"
              disabled={!(formik.isValid && formik.dirty) || isLoading}
              loading={isLoading}
            ></Button>
          </form>
        </div>
      </div>

      <ReUseModal
        open={openModal}
        setOpen={setOpenModal}
        parentClassName="sm:max-w-md w-1/3"
      >
        <div className="flex flex-col justify-center space-y-6">
          <div className="w-full flex justify-center">
            <Image src={SuccessGif} width={100} height={100} alt="" />
          </div>
          <div className="text-center space-y-6">
            <h1>Welcome onboard Alex</h1>
            <p className="text-sm text-[#475467]">
              Your account was created successfully. You are a
              <span className="font-bold"> Level 1</span> user with an auction
              and bid limit of
              <span className="font-bold"> ₦200,000 </span>
              per transaction.
            </p>
          </div>
          <div className="flex bg-[#D9F2EF] text-[#262425] text-sm justify-center w-full gap-x-2 py-2 rounded-md items-center">
            <BxsInfoCircle />
            <p>
              Upgrade to <span className="font-bold"> Level 2</span> for
              unlimited transactions.
            </p>
          </div>
          <div className="space-y-6 ">
            <Button
              label="Upgrade Now"
              buttonType="primary"
              onClick={handleDoThisLater}
            />
            <Button
              label="I will do this Later"
              buttonType="outline"
              className="!text-[#344054] font-semibold text-base !border-[#D0D5DD]"
              onClick={handleDoThisLater}
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
      <SignUp />
    </GoogleMapsWrapper>
  );
}
