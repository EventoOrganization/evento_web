"use client";

import ComingSoon from "@/components/ComingSoon";
import DeleteAccountBtn from "@/features/auth/components/DeleteAccountBtn";
import LogoutBtn from "@/features/auth/components/LogoutBtn";

const Page = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Page header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your account and privacy settings
        </p>
      </div>

      {/* Account settings section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Account Settings
        </h2>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Logout</span>
            <LogoutBtn />
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Delete Account</span>
            <DeleteAccountBtn />
          </div>
        </div>
      </section>

      {/* Security settings section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Security Settings
        </h2>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Two-Factor Authentication</span>
            <ComingSoon message=" " className="flex-row" />
            {/* <button className="text-blue-600 hover:underline">Enable</button> */}
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Change Password</span>
            <ComingSoon message=" " className="flex-row" />
            {/* <button className="text-blue-600 hover:underline">Update</button> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
