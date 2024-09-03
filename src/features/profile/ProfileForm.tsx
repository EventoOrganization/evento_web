"use client";
const ProfileForm = ({}: {}) => {
  const onSubmit = () => {};
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block">Name</label>
        <input type="text" name="name" className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block">First Name</label>
        <input
          type="text"
          name="firstName"
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block">Last Name</label>
        <input
          type="text"
          name="lastName"
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block">Country Code</label>
        <input
          type="text"
          name="countryCode"
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block">Date of Birth</label>
        <input type="date" name="DOB" className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block">Profile Image</label>
        <input type="file" className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block">Bio</label>
        <textarea name="bio" className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block">About Me</label>
        <textarea name="aboutMe" className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block">Interests</label>
        <select multiple name="interest" className="border p-2 rounded w-full">
          {/* Populate options with available interests */}
          {/* Example: <option value="interest_id">Interest Name</option> */}
        </select>
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Save Changes
      </button>
    </form>
  );
};

export default ProfileForm;
