"use server";

import { signIn } from "@/auth";
//import { User } from "@/types/user";
import AuthError from "next-auth";
import { ResultCode } from "@/utils/Helper";
import { API } from "@/constants";
import apiService from "@/lib/apiService";

export async function getUser(email: string) {
  return email;
}

interface Result {
  type: string;
  resultCode: ResultCode;
}

export async function authenticate(
  _prevState: Result | undefined,
  formData: FormData,
): Promise<Result | undefined> {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const res: any = await apiService.post(API.login, {
      email: email,
      password: password,
    });
    if (res.success === true) {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      return {
        type: "success",
        resultCode: ResultCode.UserLoggedIn,
      };
    } else {
      return {
        type: "error",
        resultCode: ResultCode.InvalidCredentials,
      };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error) {
        case "CredentialsSignin":
          return {
            type: "error",
            resultCode: ResultCode.InvalidCredentials,
          };
        default:
          return {
            type: "error",
            resultCode: ResultCode.UnknownError,
          };
      }
    }
    return {
      type: "error",
      resultCode: ResultCode.UnknownError,
    };
  }
}
