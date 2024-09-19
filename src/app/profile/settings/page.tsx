"use client";

import DeleteAccountBtn from "@/features/auth/components/DeleteAccountBtn";
import LogoutBtn from "@/features/auth/components/LogoutBtn";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2>Settings</h2>
      <LogoutBtn />
      <DeleteAccountBtn />
    </div>
  );
};

export default Page;
