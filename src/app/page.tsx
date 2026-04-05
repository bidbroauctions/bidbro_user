"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    // router.push("/auth/sign_up");
    router.push("/dashboard/user");
  }, [router]);
  return <div></div>;
};

export default Page;
