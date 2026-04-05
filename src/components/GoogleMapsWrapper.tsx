"use client";
import { LoadScriptNext } from "@react-google-maps/api";
import React from "react";

interface GoogleMapsWrapperProps {
  children: React.ReactElement;
}

const GoogleMapsWrapper: React.FC<GoogleMapsWrapperProps> = ({ children }) => {
  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""}
      libraries={["places"]}
    >
      {children}
    </LoadScriptNext>
  );
};

export default GoogleMapsWrapper;
