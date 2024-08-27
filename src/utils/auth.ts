"use server";

import { cookies } from "next/headers";

// src/utils/authUtils.ts

export const isUserLoggedInSSR = () => {
  const token = cookies().get("token");
  console.log("token", token);
  return !!token?.value;
};
