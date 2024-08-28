"use server";

import { cookies } from "next/headers";

// src/utils/authUtils.ts

export const isUserLoggedInSSR = async () => {
  const token = cookies().get("token");
  console.log("token", token);
  return !!token?.value;
};

export const getToken = async () => {
  const token = cookies().get("token");
  return token?.value;
};
