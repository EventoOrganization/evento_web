import SigninForm from "@/components/forms/Signin";
import { auth } from "@/auth";
import { Session } from "next-auth/types";
//import { Session } from "@/types/user";

export default async function SigninRoute() {
  const session = (await auth()) as Session;

  if (session) {
    // redirect("/");
  }

  return <SigninForm />;
}
