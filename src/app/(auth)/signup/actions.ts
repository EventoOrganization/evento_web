"use server";

import { signIn } from "@/auth";
import { ResultCode } from "@/utils/Helper";
import { z } from "zod";
//import { getUser } from "../signin/actions";
import AuthError from "next-auth";
import apiService from "@/lib/apiService";
import { API } from "@/constants";

export async function createUser(
  email: string,
  password: string,
  confirmPassword: string,
) {
  //const existingUser = await getUser(email);

  if (!email) {
    return {
      type: "error",
      resultCode: ResultCode.UserAlreadyExists,
    };
  } else {
    const data = {
      name: "khanh 2",
      firstName: "khanh vu",
      lastName: "khanh vu",
      email: "khanh2@mail.com",
      password: "123456",
      confirmPassword: "123456",
      phoneNumber: "12345678",
      countryCode: "+1",
      DOB: "2024-01-01",
      interest:
        '[{"_id":"648c4bed7899dc2cce7493ad","name":"Wellness","image":"bad06a48-b75b-4745-a11f-19cbb47b4756.jpeg"}]',
      deviceToken: "123",
      deviceType: "web",
    };
    await apiService.post(API.signUp, data);

    return {
      type: "success",
      resultCode: ResultCode.UserCreated,
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

  const parsedCredentials = z
    .object({
      email: z.string().email(),
      password: z.string().min(6),
    })
    .safeParse({
      email,
      password,
    });

  if (parsedCredentials.success) {
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
      if (error instanceof AuthError) {
        switch (error.type) {
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
  } else {
    return {
      type: "error",
      resultCode: ResultCode.InvalidCredentials,
    };
  }
}
