"use client";
import { Auction, BankAccount, BankAccountResolveResponse } from "@/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface DashboardContextProps {
  isLoading: boolean;
  accessToken: string | null;
  setLoading: (loading: boolean) => void;
  setAccessToken: (token: string | null) => void;
  newBankAccountDetail: BankAccountResolveResponse | null;
  setNewBankAccountDetail: React.Dispatch<
    React.SetStateAction<BankAccountResolveResponse | null>
  >;
  bankAccountDetails: BankAccount[] | [];
  setBankAccountDetails: React.Dispatch<React.SetStateAction<BankAccount[]>>;
  addNewAuction: Partial<Auction> | null;
  setAddNewAuction: React.Dispatch<
    React.SetStateAction<Partial<Auction> | null>
  >;
}

// Create a default value for the context
const DashboardContext = createContext<DashboardContextProps | undefined>(
  undefined
);

// Create a provider component
export const DashboardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, _setAccessToken] = useState<string | null>(null);
  const [newBankAccountDetail, setNewBankAccountDetail] =
    useState<BankAccountResolveResponse | null>(null);
  const [bankAccountDetails, setBankAccountDetails] = useState<BankAccount[]>(
    []
  );
  const [addNewAuction, setAddNewAuction] = useState<Partial<Auction> | null>(
    null
  );

  // Update loading state
  const setLoading = (loading: boolean) => setIsLoading(loading);

  // Update the access token
  const setAccessToken = (token: string | null) => _setAccessToken(token);

  return (
    <DashboardContext.Provider
      value={{
        isLoading,
        accessToken,
        setLoading,
        setAccessToken,
        newBankAccountDetail,
        setNewBankAccountDetail,
        bankAccountDetails,
        setBankAccountDetails,
        addNewAuction,
        setAddNewAuction,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Hook to use the context in components
export const useDashboardContext = (): DashboardContextProps => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within an DashboardProvider"
    );
  }
  return context;
};
