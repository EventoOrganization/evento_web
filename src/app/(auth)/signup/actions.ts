"use server";

import { signIn } from "@/auth";
import { ResultCode } from "@/utils/Helper";
//import { getUser } from "../signin/actions";
import { API } from "@/constants";
import apiService from "@/lib/apiService";
import AuthError from "next-auth";
interface AuthErrorType extends Error {
  type: string;
}
export async function createUser(
  email: string,
  password: string,
  confirmPassword: string,
) {
  //const existingUser = await getUser(email);
  const data = {
    name: email,
    firstName: "khanh vu",
    lastName: "khanh vu",
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    phoneNumber: "12345678",
    countryCode: "+1",
    DOB: "2024-01-01",
    interest:
      '[{"_id":"648c4bed7899dc2cce7493ad","name":"Wellness","image":"bad06a48-b75b-4745-a11f-19cbb47b4756.jpeg"}]',
    deviceToken: "123",
    deviceType: "web",
  };
  const res: any = await apiService.post(API.signUp, data);
  if (res.success === true) {
    return {
      type: "success",
      resultCode: ResultCode.UserCreated,
    };
  } else {
    return {
      type: "error",
      resultCode: ResultCode.InvalidCredentials,
    };
  }
}

interface Result {
  type: string;
  resultCode: ResultCode;
}

export async function signup(
  _prevState: Result | undefined,
  formData: FormData,
): Promise<Result | undefined> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  try {
    const result = await createUser(email, password, confirmPassword);

    if (result.resultCode === ResultCode.UserCreated) {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    }

    return result;
  } catch (error) {
    const authError = error as AuthErrorType;
    if (authError instanceof AuthError) {
      switch (authError.type) {
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
    } else {
      return {
        type: "error",
        resultCode: ResultCode.UnknownError,
      };
    }
  }
}
