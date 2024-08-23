import SignupForm from "@/components/forms/Signup";
import { auth } from "@/auth";
//import { Session } from "@/types/user";
import { Session } from "next-auth/types";
//import { redirect } from "next/navigation";

export default async function SignupRoute() {
  const session = (await auth()) as Session;

  if (session) {
    // redirect("/");
  }

  return (
    <main className="bg-white w-full">
      <SignupForm />
    </main>
  );
}
