import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

const EzEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const user = useAuthStore((state) => state.user);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Images sélectionnées:", images);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    console.log("Images avant soumission:", images);
    images.forEach((image) => {
      formData.append(`images`, image);
    });
    console.log("FormData avant envoi:", Array.from(formData.entries()));

    if (video) {
      formData.append("video", video);
    }
    console.log("Form Data before submission:", Array.from(formData.entries()));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/createEventAndRSVPform`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          body: formData,
        },
      );
      const result = await response.json();
      console.log("Response from server:", result);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Titre :</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Description :</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label>Images :</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setImages(Array.from(e.target.files));
            }
          }}
        />
      </div>
      <div>
        <label>Vidéo :</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            if (e.target.files) {
              setVideo(e.target.files[0]);
            }
          }}
        />
      </div>
      <button type="submit">Créer l&apos;événement</button>
    </form>
  );
};

export default EzEventForm;
