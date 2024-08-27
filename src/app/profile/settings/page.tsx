import ComingSoon from "@/components/ComingSoon";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const token = cookies().get("token");
  const authHeader = {
    Authorization: `Bearer ${token?.value}`,
  };
  const logout = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/logout`,
    {
      method: "POST",
      headers: authHeader,
    },
  );

  if (logout.ok) {
    redirect("/signin");
  }

  return (
    <ComingSoon message="This page is under construction. Please check back later!" />
  );
};

export default page;
