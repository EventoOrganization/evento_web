import ProfileForm from "@/features/profile/ProfileForm";

const EditProfilePage = ({ user }: { user: any }) => {
  console.log("user", user);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <ProfileForm />
    </div>
  );
};

export default EditProfilePage;
