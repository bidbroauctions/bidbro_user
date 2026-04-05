"use client";
import { useUserStore } from "@/store/useUserStore";
import React, { useEffect } from "react";
import { logOut } from "../auth/api/AuthService";
import { useRouter } from "next/navigation";

const Page = () => {
  const { accessToken, clearUser } = useUserStore();
  const router = useRouter();
  useEffect(() => {
    logOut().then(() => {
      clearUser();
      router.replace("/auth/login");
    });
  }, [accessToken, clearUser, router]);
  return <div></div>;
};

export default Page;
