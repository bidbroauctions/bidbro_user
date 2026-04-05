// helpers/media.utils.ts

/**
 * Generates a thumbnail for video files.
 * @param file - The video file from which to extract the thumbnail.
 * @returns Promise<string> - A promise that resolves to the base64 thumbnail string.
 */
export const extractVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement("video");
    const canvasElement = document.createElement("canvas");
    const videoUrl = URL.createObjectURL(file);

    videoElement.src = videoUrl;

    videoElement.addEventListener("loadeddata", () => {
      videoElement.currentTime = 2; // Set the time to capture the thumbnail.
    });

    videoElement.addEventListener("seeked", () => {
      const ctx = canvasElement.getContext("2d");
      if (ctx) {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        ctx.drawImage(
          videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        const thumbnailUrl = canvasElement.toDataURL();
        resolve(thumbnailUrl);
      } else {
        reject(new Error("Unable to get canvas context"));
      }
      URL.revokeObjectURL(videoUrl);
    });

    videoElement.addEventListener("error", (error) => {
      reject(error);
    });
  });
};

// helpers/media.utils.ts

/**
 * Generates a thumbnail for video URLs.
 * @param videoUrl - The URL of the video from which to extract the thumbnail.
 * @returns Promise<string> - A promise that resolves to the base64 thumbnail string.
 */
export const extractVideoThumbnailFromUrl = (
  videoUrl: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement("video");
    const canvasElement = document.createElement("canvas");

    // Set the crossOrigin attribute to allow CORS if the server supports it
    videoElement.crossOrigin = "anonymous";
    videoElement.src = videoUrl;

    videoElement.addEventListener("loadeddata", () => {
      videoElement.currentTime = 2; // Set the time to capture the thumbnail.
    });

    videoElement.addEventListener("seeked", () => {
      const ctx = canvasElement.getContext("2d");
      if (ctx) {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        ctx.drawImage(
          videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        try {
          const thumbnailUrl = canvasElement.toDataURL(); // Try exporting the thumbnail
          resolve(thumbnailUrl);
        } catch (error) {
          reject(
            new Error(
              "Cannot export canvas: Tainted canvas due to CORS policy."
            )
          );
        }
      } else {
        reject(new Error("Unable to get canvas context"));
      }
    });

    videoElement.addEventListener("error", (error) => {
      reject(error);
    });
  });
};
