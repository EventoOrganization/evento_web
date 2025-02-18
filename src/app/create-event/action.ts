"use server";
import { deleteFileFromS3, uploadFileToS3 } from "@/lib/s3";
export async function handleUpload(
  formData: FormData,
  folderPath: string = "events/initialMedia",
): Promise<string[]> {
  // Assurez-vous de retourner un tableau de chaînes (URLs)
  const files = formData.getAll("file") as File[];
  const urls: string[] = [];

  try {
    for (const file of files) {
      const { url } = await uploadFileToS3(file, folderPath);
      urls.push(url); // Ajouter l'URL au tableau
    }
    console.log("All uploads successful");
    return urls; // Retourner les URLs après l'upload
  } catch (error) {
    console.error("Upload failed", error);
    return [];
  }
}
export async function handleDeleteMedia(fileKey: string): Promise<boolean> {
  console.log("Deleting file from S3:", fileKey);

  try {
    const response = await deleteFileFromS3(fileKey);

    console.log("File deleted successfully:", response);
    return response.success;
  } catch (error) {
    console.error("Error deleting file from S3 or DB:", error);
    return false;
  }
}
export async function normalizeEvent(event: any) {
  return {
    ...event,
    details: {
      ...event.details,
      coordinates:
        event.details?.coordinates || event.details?.loc?.coordinates || [],
      location: event.details?.location || "",
      date: new Date(event.details?.date).toISOString(),
      endDate: new Date(event.details?.endDate).toISOString(),
      timeSlots: event.details?.timeSlots || [],
      description: event.details?.description || "",
      includeChat: event.details?.includeChat || false,
      createRSVP: event.details?.createRSVP || false,
      Urllink: event.details?.Urllink || "",
      Urltitle: event.details?.Urltitle || "",
      images: event.details?.images || [],
      videos: event.details?.videos || [],
    },
    user: event.user || {},
    initialMedia: event.initialMedia || [],
    coHosts: event.coHosts || [],
    guests: event.guests || [],
    tempGuests: event.tempGuests || [],
    favouritees: event.favouritees || [],
    attendees: event.attendees || [],
    questions: event.questions || [],
    coHostStatus: event.coHostStatus || false,
    guestsAllowFriend: event.guestsAllowFriend || false,
    isGoing: event.isGoing || false,
    isFavourite: event.isFavourite || false,
    isRefused: event.isRefused || false,
  };
}
