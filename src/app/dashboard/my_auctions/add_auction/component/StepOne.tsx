"use client";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Select from "@/components/form/selection";
import Input from "@/components/form/input";
import Button from "@/app/dashboard/component/Button";
import AddressAutocomplete from "@/components/AddressAutoComplete"; // Import the AddressAutocomplete component
import { useUserStore } from "@/store/useUserStore";
import CategoryService from "@/app/api/CategoryService";
import toast from "react-hot-toast";
import { auctions } from "@/app/mock/auction";
import { useDashboardContext } from "@/app/dashboard/context/DashboardContext";
import { Location, PurchaseStatus } from "@/types";
import GoogleMapsWrapper from "@/components/GoogleMapsWrapper";
import DatePickerInput from "@/components/form/datePickerInput";
import { useDatePicker } from "@/app/dashboard/component/DatePicker";

// Validation Schema
const validationSchema = Yup.object().shape({
  category: Yup.object()
    .shape({
      id: Yup.string().required("Category is required"),
      name: Yup.string().required("Category Name is required"),
    })
    .required("Category is required"),

  make: Yup.string().required("Make is required"),
  model: Yup.string().required("Model is required"),
  year_manufactured: Yup.string()
    .matches(/^\d{4}$/, "Year must be 4 digits")
    .required("Year of manufacture is required"),
  year_purchased: Yup.string()
    .matches(/^\d{4}$/, "Year must be 4 digits")
    .required("Year of purchase is required"),
  purchase_type: Yup.string().required("Purchase type is required"),
  asset_functional: Yup.string().required(
    "Asset functional status is required"
  ),
  asset_location: Yup.object().shape({
    placeId: Yup.string().required("Place ID is required"),
    fullAddress: Yup.string().required("Full address is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    coordinates: Yup.object().shape({
      lat: Yup.number().required("Latitude is required"),
      lng: Yup.number().required("Longitude is required"),
    }),
  }),
  description: Yup.string().required("Description is required"),
  reserve_price: Yup.number()
    .required("Reserve price is required")
    .min(0, "Price must be a positive number"),
  buy_now_price: Yup.number().min(0, "Price must be a positive number"),
  auction_date: Yup.date().required("Auction date is required"),
  asset_release_period: Yup.date().required("Asset release period is required"),
});

const AuctionDetailsForm = ({
  setCurrentStep,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { setAddNewAuction } = useDashboardContext();
  const dummyAuction = auctions[0];

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      category: dummyAuction.category,
      make: dummyAuction.make,
      model: dummyAuction.model,
      year_manufactured: dummyAuction.yearOfManufacture,
      year_purchased: dummyAuction.yearOfPurchase,
      purchase_type: dummyAuction.purchaseStatus,
      asset_functional: dummyAuction.functional,
      asset_location: dummyAuction.location,
      description: dummyAuction.description,
      reserve_price: dummyAuction.reservedPrice,
      buy_now_price: dummyAuction.buyNowPrice,
      auction_date: dummyAuction.bidStartDate,
      asset_release_period: dummyAuction.bidEndDate,
    },
    validationSchema,
    onSubmit: (values) => {
      setAddNewAuction((prev) => ({
        ...prev,
        ...{
          make: values.make,
          model: values.model,
          yearOfManufacture: values.year_manufactured,
          yearOfPurchase: values.year_purchased,
          purchaseStatus: values.purchase_type,
          functional: values.asset_functional,
          location: values.asset_location,
          description: values.description,
          reservedPrice: values.reserve_price,
          buyNowPrice: values.buy_now_price,
          bidStartDate: values.auction_date,
          bidEndDate: values.asset_release_period,
          category: values.category,
        },
      }));
      setCurrentStep(2); // Move to next step after submission
    },
  });

  // Fetch categories
  const { categories, setCategories } = useUserStore();
  useEffect(() => {
    if (categories.length === 0) {
      CategoryService.FetchCategoriesService({}).then((res) => {
        if (res.success) {
          setCategories(res.data.records);
        } else {
          toast.error(res.message);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  // Handle address selection from AddressAutocomplete for the auction form
  const handleAddressSelect = (location: Location) => {
    formik.setFieldValue("asset_location", {
      placeId: location.placeId,
      fullAddress: location.fullAddress,
      state: location.state,
      country: location.country,
      coordinates: location.coordinates,
    });
  };

  // Array of form fields and their properties
  const formFields = [
    {
      name: "category",
      label: "Item Category",
      type: "select",
      options: [
        { value: "", label: "Select category" },
        ...categories.map((category) => ({
          value: category.id,
          label: category.name,
        })),
      ],
      gridSpan: 1,
    },
    {
      name: "make",
      label: "Make",
      type: "input",
      placeholder: "Enter the make",
      gridSpan: 1,
    },
    {
      name: "description",
      label: "Asset description",
      type: "textarea",
      placeholder: "Enter description",
      gridSpan: 2, // Span two columns
    },
    {
      name: "model",
      label: "Model",
      type: "input",
      placeholder: "Enter the model",
      gridSpan: 1,
    },
    {
      name: "year_manufactured",
      label: "Year of manufacture",
      type: "input",
      placeholder: "YYYY",
      gridSpan: 1,
    },
    {
      name: "year_purchased",
      label: "Year of purchase",
      type: "input",
      placeholder: "YYYY",
      gridSpan: 1,
    },
    {
      name: "purchase_type",
      label: "Purchase New or Used",
      type: "select",
      options: [
        { value: "", label: "Select Purchase Type" },
        { value: PurchaseStatus.BRAND_NEW, label: "New" },
        { value: PurchaseStatus.USED, label: "Used" },
      ],
      gridSpan: 1,
    },
    {
      name: "asset_functional",
      label: "Asset Functional?",
      type: "select",
      options: [
        { value: "", label: "Select Option" },
        { value: "YES", label: "Yes" },
        { value: "NO", label: "No" },
      ],
      gridSpan: 1,
    },
    {
      name: "asset_location",
      label: "Asset Location (Full Address)",
      type: "address", // Update to reflect address field
      gridSpan: 1,
    },
    {
      name: "reserve_price",
      label: "Reserve Price",
      type: "input",
      placeholder: "₦0.00",
      sub_type: "currency",
      gridSpan: 1,
    },
    {
      name: "buy_now_price",
      label: "Buy Now Price (Optional)",
      type: "input",
      placeholder: "₦0.00",
      sub_type: "currency",
      gridSpan: 1,
    },
    {
      name: "auction_date",
      label: "Auction Date",
      type: "input",
      sub_type: "date",
      placeholder: "dd/mm/yyyy",
      gridSpan: 1,
    },
    {
      name: "asset_release_period",
      label: "Asset Release Period",
      type: "input",
      sub_type: "date",
      placeholder: "dd/mm/yyyy",
      gridSpan: 1,
    },
  ];
  // Separate formik values, errors, and touched states for easier manipulation
  const valuesWithoutLocationAndCategory = {
    ...formik.values,
    asset_location: "",
    category: "",
  };
  const errorsWithoutLocationAndCategory = {
    ...formik.errors,
    asset_location: "",
    category: "",
  };
  const touchedWithoutLocationAndCategory = {
    ...formik.touched,
    asset_location: "",
    category: "",
  };
  const { startDate: auction_date, handleChange: handleAuctionDateChange } =
    useDatePicker(
      !formik.values.auction_date ? null : new Date(formik.values.auction_date)
    );
  const {
    startDate: asset_release_period,
    handleChange: handleAssetReleasePeriodChange,
  } = useDatePicker(
    !formik.values.asset_release_period
      ? null
      : new Date(formik.values.asset_release_period)
  );
  const dates = {
    auction_date: {
      startDate: auction_date,
      handleChange: handleAuctionDateChange,
    },
    asset_release_period: {
      startDate: asset_release_period,
      handleChange: handleAssetReleasePeriodChange,
    },
  };
  useEffect(() => {
    formik.setFieldValue("auction_date", auction_date?.toISOString());
  }, [auction_date, formik]);

  useEffect(() => {
    formik.setFieldValue(
      "asset_release_period",
      asset_release_period?.toISOString()
    );
  }, [asset_release_period, formik]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-2 gap-6">
        {formFields.map((field, index) => {
          return (
            <div key={index} className={`col-span-${field.gridSpan}`}>
              {field.type === "input" &&
                field.name !== "asset_location" &&
                field.sub_type !== "date" && (
                  <Input
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={
                      valuesWithoutLocationAndCategory[
                        field.name as keyof typeof valuesWithoutLocationAndCategory
                      ]
                    }
                    type={field.sub_type || "text"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      touchedWithoutLocationAndCategory[
                        field.name as keyof typeof touchedWithoutLocationAndCategory
                      ] &&
                      errorsWithoutLocationAndCategory[
                        field.name as keyof typeof errorsWithoutLocationAndCategory
                      ]
                        ? errorsWithoutLocationAndCategory[
                            field.name as keyof typeof errorsWithoutLocationAndCategory
                          ]
                        : undefined
                    }
                  />
                )}
              {field.type === "input" && field.sub_type === "date" && (
                <DatePickerInput
                  label={field.label}
                  placeholder={field.placeholder}
                  startDate={
                    dates[field.name as "auction_date" | "asset_release_period"]
                      .startDate
                  } // Typecast the field.name
                  handleChange={
                    dates[field.name as "auction_date" | "asset_release_period"]
                      .handleChange
                  }
                  error={
                    touchedWithoutLocationAndCategory[
                      field.name as keyof typeof touchedWithoutLocationAndCategory
                    ] &&
                    errorsWithoutLocationAndCategory[
                      field.name as keyof typeof errorsWithoutLocationAndCategory
                    ]
                      ? errorsWithoutLocationAndCategory[
                          field.name as keyof typeof errorsWithoutLocationAndCategory
                        ]
                      : undefined
                  }
                />
              )}

              {field.type === "select" ? (
                field.name === "category" ? (
                  <Select
                    name="category"
                    label="Item Category"
                    options={field.options!}
                    value={formik.values.category?.id} // Set value to the category ID
                    onChange={(e) => {
                      const selectedCategoryId = e.target.value;
                      const selectedCategory = categories.find(
                        (category) => category.id === selectedCategoryId
                      );
                      formik.setFieldValue("category", {
                        id: selectedCategory?.id || "",
                        name: selectedCategory?.name || "",
                      }); // Update the entire category object with id and name
                    }}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.category?.id && formik.errors.category?.id
                        ? formik.errors.category?.id
                        : undefined
                    }
                  />
                ) : (
                  <Select
                    name={field.name}
                    label={field.label}
                    options={field.options!}
                    value={
                      field.name === "category"
                        ? formik.values.category.id
                        : valuesWithoutLocationAndCategory[
                            field.name as keyof typeof valuesWithoutLocationAndCategory
                          ]
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      touchedWithoutLocationAndCategory[
                        field.name as keyof typeof touchedWithoutLocationAndCategory
                      ] &&
                      errorsWithoutLocationAndCategory[
                        field.name as keyof typeof errorsWithoutLocationAndCategory
                      ]
                        ? errorsWithoutLocationAndCategory[
                            field.name as keyof typeof errorsWithoutLocationAndCategory
                          ]
                        : undefined
                    }
                  />
                )
              ) : null}

              {field.type === "textarea" && (
                <Input
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={
                    valuesWithoutLocationAndCategory[
                      field.name as keyof typeof valuesWithoutLocationAndCategory
                    ]
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    touchedWithoutLocationAndCategory[
                      field.name as keyof typeof touchedWithoutLocationAndCategory
                    ] &&
                    errorsWithoutLocationAndCategory[
                      field.name as keyof typeof errorsWithoutLocationAndCategory
                    ]
                      ? errorsWithoutLocationAndCategory[
                          field.name as keyof typeof errorsWithoutLocationAndCategory
                        ]
                      : undefined
                  }
                  as="textarea"
                />
              )}

              {field.type === "address" && (
                <AddressAutocomplete
                  label="Asset Location"
                  onSelectAddress={handleAddressSelect}
                  error={
                    formik.touched.asset_location?.fullAddress &&
                    formik.errors.asset_location?.fullAddress
                      ? formik.errors.asset_location.fullAddress
                      : ""
                  }
                  parentClassName="col-span-2"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-6 w-full">
        <div className="w-[calc(50%-24px)] px-6">
          <Button
            type="submit"
            className="bg-[#F68B36] text-white px-10 w-full"
            disabled={!(formik.isValid && formik.dirty)}
          >
            Next
          </Button>
        </div>
      </div>
    </form>
  );
};

export default function StepOne({
  setCurrentStep,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <GoogleMapsWrapper>
      <AuctionDetailsForm setCurrentStep={setCurrentStep} />
    </GoogleMapsWrapper>
  );
}
