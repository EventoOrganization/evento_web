"use server";
import { deleteFileFromS3, uploadFileToS3 } from "@/lib/s3";
export async function handleUpload(formData: FormData): Promise<string[]> {
  // Assurez-vous de retourner un tableau de chaînes (URLs)
  const files = formData.getAll("file") as File[];
  const urls: string[] = [];

  try {
    for (const file of files) {
      const { url } = await uploadFileToS3(file, "events/initialMedia");
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
  if (fileKey.startsWith("events/initialMedia")) {
    // Supprimer le fichier de S3 si le fichier est dans le dossier "events/"
    try {
      const response = await deleteFileFromS3(fileKey);
      console.log("File deleted successfully:", response);
      return response.success;
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      return false;
    }
  }
  return true; // Si le fichier est prédéfini, ne pas le supprimer de S3
}
