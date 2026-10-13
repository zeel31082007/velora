import { supabase } from "@/lib/supabaseClient";

const BUCKET_NAME = "Velora-media";

export async function uploadMemoryMedia(
  file: File,
  memoryId: string,
): Promise<string> {
  const extension = file.name.split(".").pop() || "bin";
  const filePath = `${memoryId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(`Media upload failed: ${error.message}`);
  }

  return filePath;
}

export async function getMemoryMediaUrl(
  filePath: string,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 60 * 60);

  if (error || !data?.signedUrl) {
    throw new Error(
      `Could not create media URL: ${error?.message ?? "Unknown error"}`,
    );
  }

  return data.signedUrl;
}