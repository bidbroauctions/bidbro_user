"use client";
import { usePathname } from "next/navigation";

import Link from "next/link";

import classNames from "classnames";
import BarChartSquare from "@/assets/icons/bar-chart-square-02";
import BxUser from "@/assets/icons/Secondary/Outline/bx-user";
import LayersThree from "@/assets/icons/layers-three-01";
import BxWalletAlt from "@/assets/icons/Secondary/Outline/bx-wallet-alt";
import BxGift from "@/assets/icons/Secondary/Outline/bx-gift";
import SettingsIcon from "@/assets/icons/settings-01";
import { useState } from "react";
// Define the routes and their properties

export default function SideBar({ className }: { className?: string }) {
  const pathname = usePathname();
  const routes: RouteProps[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: BarChartSquare,
    },
    {
      name: "My Bids",
      path: "/dashboard/my_bids",
      icon: LayersThree,
    },
    {
      name: "My Auctions",
      path: "/dashboard/my_auctions",
      icon: LayersThree,
    },
    {
      name: "Account",
      path: "/dashboard/account",
      icon: BxWalletAlt,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: BxUser,
    },
    {
      name: "Referral/Rewards",
      path: "/dashboard/referral",
      icon: BxGift,
    },
  ];
  const bottomRoutes: RouteProps[] = [
    {
      name: "Log Out",
      path: "/logout",
      icon: SettingsIcon, // If you don't need an icon for the log out link
    },
  ];

  return (
    <aside className={`${className}`}>
      <ul className="space-y-6 p-5">
        {routes.map((route) => {
          const isActive = (pathname: string) => {
            // Specifically check for /dashboard/user and /dashboard/company for the "Dashboard" route
            if (
              route.path === "/dashboard" &&
              (pathname.startsWith("/dashboard/user") ||
                pathname.startsWith("/dashboard/company"))
            ) {
              return true;
            }
            if (
              route.path === "/dashboard/my_bids" &&
              pathname.startsWith("/dashboard/my_bids")
            ) {
              return true;
            }
            if (
              route.path === "/dashboard/my_auctions" &&
              pathname.startsWith("/dashboard/my_auctions")
            ) {
              return true;
            }

            return pathname === route.path;
          };
          route.isActive = isActive(pathname);
          return <RenderRoutes route={route} key={route.name} />;
        })}
        <div className="w-full h-[2px] bg-[#EBEBEB] border-b-10 border-b-0"></div>
        {bottomRoutes.map((route) => (
          <RenderRoutes route={route} key={route.name} />
        ))}
      </ul>
    </aside>
  );
}
interface RouteProps {
  name: string;
  path: string;
  icon: ({ color }: { color: string }) => JSX.Element;
  isActive?: boolean;
}
function RenderRoutes({ route }: { route: RouteProps }) {
  const { isActive } = route;
  // State to track hover status
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={route.path}
      key={route.name}
      className={classNames(
        `flex items-center gap-3 px-3 py-2 rounded-md group`,
        {
          "bg-[#F68B36] text-white": isActive || isHovered, // Apply styles when active or hovered
          "hover:bg-[#F68B36] hover:text-white": !isActive, // Apply hover only when not active
        }
      )}
      // Detect hover state
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-2">
        {route.icon && (
          <route.icon
            color={isActive || isHovered ? "white" : "#667085"} // Icon color changes on hover
          />
        )}
        <span>{route.name}</span>
      </div>
    </Link>
  );
}
