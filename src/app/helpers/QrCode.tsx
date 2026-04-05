import { QRCodeSVG } from "qrcode.react";

const QrCode = ({
  url,
  size,
  bgColor = "#ffffff",
  fgColor = "#000000",
  level = "M", // Default to Medium
}: {
  url: string;
  size: number;
  bgColor?: string;
  fgColor?: string;
  level?: "L" | "M" | "Q" | "H"; // Optional error correction level
}) => {
  return (
    <QRCodeSVG
      value={url}
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}
      level={level}
      marginSize={0}
    />
  );
};

export default QrCode;
