import SignupForm from "@/components/forms/Signup";
//import { auth } from "@/auth";
//import { Session } from "@/types/user";
//import { redirect } from "next/navigation";

export default async function SignupRoute() {
  //const session = (await auth()) as Session;

  // if (session) {
  //   redirect("/");
  // }

  return (
    <main className="flex flex-col p-4">
      <SignupForm />
    </main>
  );
}
