import { FileUploadResponse } from "@/types";

export const formatString = (str: string) => {
  // format IN_PROGRESS to In Progress
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
};

export const fetchMediaImages = (media: Partial<FileUploadResponse>[]) => {
  return media
    .filter(
      (media) =>
        !!media?.url &&
        (media?.contentType?.toLocaleLowerCase()?.includes("image") ||
          media?.type?.toLocaleLowerCase()?.includes("image"))
    )
    .map((media) => media?.url) as string[];
};

export const fetchMediaVideos = (media: Partial<FileUploadResponse>[]) => {
  return media
    .filter(
      (media) =>
        !!media?.url &&
        (media?.contentType?.toLocaleLowerCase()?.includes("video") ||
          media?.type?.toLocaleLowerCase()?.includes("video"))
    )
    .map((media) => media?.url) as string[];
};
