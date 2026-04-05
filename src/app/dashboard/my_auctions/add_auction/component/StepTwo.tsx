"use client";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import ImagePicker from "./ImagePicker";
import Button from "@/app/dashboard/component/Button";
import FileService from "@/app/api/FileService";
import { useUserStore } from "@/store/useUserStore";
import { useDashboardContext } from "@/app/dashboard/context/DashboardContext";
import { Auction, AuctionMedia, FileUploadResponse } from "@/types";
interface FormValues {
  [key: string]: {
    type: AuctionMedia;
    url: string;
    description: string;
  };
}
// Validation Schema for Step 2 (Media Uploads)
const validationSchema = Yup.object().shape({
  front_view: Yup.object()
    .shape({
      type: Yup.mixed().default(AuctionMedia.IMAGE_FRONT), // Predefined type
      url: Yup.string().required("Front view image URL is required"), // Ensure URL is required
      description: Yup.string().nullable(), // Optional description field
    })
    .required("Front view image is required"),

  back_view: Yup.object()
    .shape({
      type: Yup.mixed().default(AuctionMedia.IMAGE_BACK), // Predefined type
      url: Yup.string().required("Back view image URL is required"), // Ensure URL is required
      description: Yup.string().nullable(),
    })
    .required("Back view image is required"),

  right_view: Yup.object()
    .shape({
      type: Yup.mixed().default(AuctionMedia.IMAGE_RIGHT), // Predefined type
      url: Yup.string().required("Right view image URL is required"), // Ensure URL is required
      description: Yup.string().nullable(),
    })
    .required("Right view image is required"),

  left_view: Yup.object()
    .shape({
      type: Yup.mixed().default(AuctionMedia.IMAGE_LEFT), // Predefined type
      url: Yup.string().required("Left view image URL is required"), // Ensure URL is required
      description: Yup.string().nullable(),
    })
    .required("Left view image is required"),

  inside_view: Yup.object()
    .shape({
      type: Yup.mixed().default(AuctionMedia.IMAGE_INSIDE), // Predefined type
      url: Yup.string().nullable(), // Optional field
      description: Yup.string().nullable(),
    })
    .nullable(), // Optional, allows null

  other_view: Yup.object()
    .shape({
      type: Yup.mixed().default(AuctionMedia.IMAGE_OTHER), // Predefined type
      url: Yup.string().nullable(), // Optional field
      description: Yup.string().nullable(),
    })
    .nullable(), // Optional, allows null

  functioning_video: Yup.object()
    .shape({
      type: Yup.mixed().default(AuctionMedia.VIDEO), // Predefined type
      url: Yup.string().required("Functioning video URL is required"), // Ensure URL is required
      description: Yup.string().nullable(),
    })
    .required("Functioning video is required"),
});

export const StepTwoForm = ({
  handleOpenAddAuctionModal,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleOpenAddAuctionModal(): void;
}) => {
  const { addNewAuction, setAddNewAuction } = useDashboardContext();

  // Initialize formik with correct initial values
  const formik = useFormik<FormValues>({
    initialValues: {
      front_view: { type: AuctionMedia.IMAGE_FRONT, url: "", description: "" },
      back_view: { type: AuctionMedia.IMAGE_BACK, url: "", description: "" },
      right_view: { type: AuctionMedia.IMAGE_RIGHT, url: "", description: "" },
      left_view: { type: AuctionMedia.IMAGE_LEFT, url: "", description: "" },
      inside_view: {
        type: AuctionMedia.IMAGE_INSIDE,
        url: "",
        description: "",
      },
      other_view: { type: AuctionMedia.IMAGE_OTHER, url: "", description: "" },
      functioning_video: { type: AuctionMedia.VIDEO, url: "", description: "" },
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const newAuction = {
        ...addNewAuction,
        media: Object.values(values) as unknown as FileUploadResponse[],
      } as Auction;
      // Update auction media details in the context
      setAddNewAuction(newAuction);

      handleOpenAddAuctionModal();

      console.log("Media Files Submitted:", values);
    },
  });

  const uploadFields = [
    {
      name: "front_view",
      label: "Front View",
      required: true,
      accept: "image/*",
    },
    {
      name: "back_view",
      label: "Back View",
      required: true,
      accept: "image/*",
    },
    {
      name: "right_view",
      label: "Right View",
      required: true,
      accept: "image/*",
    },
    {
      name: "left_view",
      label: "Left View",
      required: true,
      accept: "image/*",
    },
    {
      name: "inside_view",
      label: "Inside",
      required: false,
      accept: "image/*",
    },
    {
      name: "other_view",
      label: "Any other relevant picture",
      required: false,
      accept: "image/*",
    },
    {
      name: "functioning_video",
      label: "Live functioning video",
      required: true,
      accept: "video/*",
    },
  ];

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-4 gap-6">
        {uploadFields.map((field, index) => (
          <UploadField
            field={field}
            index={index}
            formik={formik}
            key={index}
          />
        ))}
      </div>
      <div className="flex justify-end mt-6 w-full">
        <Button
          type="submit"
          className="bg-[#F68B36] text-white px-10 w-[calc(50%-24px)]"
          disabled={!(formik.isValid && formik.dirty)}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

function UploadField({
  field,
  index,
  formik,
}: {
  field: { name: string; label: string; required: boolean; accept: string };
  index: number;
  formik: ReturnType<typeof useFormik>;
}) {
  const { user, company } = useUserStore();
  const id = company?.id || user?.id;
  const [uploadProgress, setUploadProgress] = React.useState<number>(-1);
  useEffect(() => {
    if (uploadProgress === 100) {
      setTimeout(() => {
        setUploadProgress(-1);
      }, 200);
    }
  }, [uploadProgress]);
  const handleFileUpload = async ({
    file,
    fieldName,
  }: {
    file: File;
    fieldName: string;
  }) => {
    if (file) {
      const res = await FileService.UploadFileService(
        file,
        {
          type: "ITEM",
          fileName: `auction_asset_${id}_${fieldName}${Date.now()}`,
          updateIfExists: true,
          description: `Auction asset ${fieldName}`,
        },
        (progressEvent) => {
          if (progressEvent) {
            const progress = progressEvent.progress
              ? progressEvent.progress * 100
              : 0;
            setUploadProgress(parseInt(progress.toFixed(0)));
            console.log(`File Upload Progress: ${progress}%`);
            // Update the progress bar in the UI here
          }
        }
      );

      const fileUploaded = res.data;

      // Set URL and description for the specific field
      formik.setFieldValue(fieldName, {
        description: fileUploaded.description,
        url: fileUploaded.url,
        type: formik.values[fieldName].type,
      });
    }
  };
  return (
    <div key={index}>
      <label>
        {index + 1}. {field.label}{" "}
        <span className="text-xs text-red-500">
          {field.required ? "*" : ""}
        </span>
      </label>
      <ImagePicker
        acceptedFileTypes={[field.accept]}
        onFileSelect={(file) => {
          if (file) handleFileUpload({ file, fieldName: field.name });
        }}
        parentClassName="max-w-[300px] min-h-[200px] w-full h-full"
        uploadProgress={uploadProgress} // Pass the progress to ImagePicker
      />
    </div>
  );
}

export default StepTwoForm;
