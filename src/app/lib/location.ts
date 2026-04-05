"use server";
import { headers } from "next/headers";
// get location from browser using server component
export async function getHostUrl() {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
