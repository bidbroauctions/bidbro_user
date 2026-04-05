"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface AppContextProps {
  isLoading: boolean;
  accessToken: string | null;
  setLoading: (loading: boolean) => void;
  setAccessToken: (token: string | null) => void;
  isModal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create a default value for the context
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, _setAccessToken] = useState<string | null>(null);
  const [isModal, setModal] = useState(false);

  // Update loading state
  const setLoading = (loading: boolean) => setIsLoading(loading);

  // Update the access token
  const setAccessToken = (token: string | null) => _setAccessToken(token);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        accessToken,
        setLoading,
        setAccessToken,
        isModal,
        setModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context in components
export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
