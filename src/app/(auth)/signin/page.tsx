import SigninForm from "@/components/forms/Signin";
//import { auth } from "@/auth";
//import { Session } from "@/types/user";
//import { redirect } from "next/navigation";

export default async function SigninRoute() {
  //const session = (await auth()) as Session;

  // if (session) {
  //   redirect("/");
  // }

  return (
    <main className="flex flex-col p-4">
      <SigninForm />
    </main>
  );
}
