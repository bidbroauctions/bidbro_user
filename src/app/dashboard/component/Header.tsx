"use client";
import React from "react";
import Logo from "@/assets/logo.png";
import SearchIcon from "@/assets/icons/search-lg.svg";
import BellIcon from "@/assets/icons/Secondary/Outline/bx-bell.svg";
import ProfileImage from "@/assets/images/profile.png";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { usePathname } from "next/navigation";

const Header = () => {
  const { company, user } = useUserStore();
  const isCompanyAccount = company?.id;
  const email =
    (isCompanyAccount ? company?.email || user?.email : user?.email) ||
    "e**@***.com";
  const name =
    (isCompanyAccount
      ? company?.name
      : `${user?.firstName} ${user?.lastName}`) || "User";
  const logo =
    (isCompanyAccount ? company?.logoUrl : user?.imageUrl) || ProfileImage;

  const pathname = usePathname();
  const isProfileDashboard = pathname === "/dashboard/profile";

  return (
    <header className="h-[120px] w-full flex items-center justify-between px-6">
      {/* Fixing the logo */}
      <div className="fixed left-6 top-10">
        <Image src={Logo} alt="Logo" width={150} height={50} />
      </div>
      <div className="ml-[250px] flex justify-between w-full gap-10 pl-[180px] items-center">
        {isProfileDashboard ? (
          <h1 className="text-4xl font-sans text-[#1B1F24] font-bold ">
            Profile
          </h1>
        ) : (
          <div className="bg-white border border-[#D0D5DD] rounded-lg px-4 py-3 flex gap-3 w-full">
            <Image src={SearchIcon} alt="Search Icon" width={24} height={24} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full focus:outline-none"
            />
          </div>
        )}

        {/* Profile */}
        <div className="flex items-center flex-shrink-0 gap-5">
          <div>
            <Image src={BellIcon} alt="Bell Icon" width={24} height={24} />
          </div>
          <div className="border-l border-l-[#EBEBEB flex gap-3 items-center pl-4">
            <div>
              <Image
                src={logo}
                alt="Profile Image"
                width={40}
                height={40}
                className="rounded-full w-10 h-10"
              />
            </div>
            <div>
              <p>{name}</p>
              <p>{email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
