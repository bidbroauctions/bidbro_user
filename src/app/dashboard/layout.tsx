import React from "react";
import SideBar from "./component/SideBar"; // Import the sidebar component
import Header from "./component/Header";
import { DashboardProvider } from "./context/DashboardContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] space-y-6">
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar className="fixed top-[calc(120px+24px)] left-0 w-[250px] h-[calc(80vh-120px)] bg-white shadow-md" />

        {/* Main Content */}
        <main className="ml-[250px] flex-1 px-6 overflow-auto">
          {/* Here the children components will be rendered */}
          <DashboardProvider>{children}</DashboardProvider>
        </main>
      </div>
    </div>
  );
}
