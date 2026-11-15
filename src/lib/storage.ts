import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const WASTE_IMAGES_BUCKET = "waste-images";

export function getSupabaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) return process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (process.env.SUPABASE_URL) return process.env.SUPABASE_URL;

  const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (dbUrl) {
    const match = dbUrl.match(/postgres\.([a-zA-Z0-9_-]+):/);
    if (match && match[1]) {
      return `https://${match[1]}.supabase.co`;
    }
  }

  return "https://elsbjcatfaifimatnnth.supabase.co";
}

export function getSupabaseServerKey(): string | null {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    null
  );
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getSupabaseServerKey();

  if (!key) {
    throw new Error(
      "Supabase Storage credentials missing: Please define SUPABASE_SERVICE_ROLE_KEY (recommended) or NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables."
    );
  }

  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
}

let bucketChecked = false;

export async function ensureBucketExists(client: SupabaseClient): Promise<void> {
  if (bucketChecked) return;

  try {
    const { data: buckets, error } = await client.storage.listBuckets();
    if (!error && buckets) {
      const exists = buckets.some((b) => b.name === WASTE_IMAGES_BUCKET);
      if (!exists) {
        await client.storage.createBucket(WASTE_IMAGES_BUCKET, {
          public: true,
          fileSizeLimit: 8 * 1024 * 1024,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
        });
      }
      bucketChecked = true;
    }
  } catch {
    bucketChecked = true;
  }
}

export async function uploadWasteImage(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ imageUrl: string; path: string }> {
  const supabase = getSupabaseServerClient();
  await ensureBucketExists(supabase);

  const { data, error } = await supabase.storage
    .from(WASTE_IMAGES_BUCKET)
    .upload(fileName, buffer, {
      contentType,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(WASTE_IMAGES_BUCKET)
    .getPublicUrl(data.path);

  return {
    imageUrl: urlData.publicUrl,
    path: data.path,
  };
}

export async function downloadWasteImageBuffer(imageUrlOrPath: string): Promise<Buffer> {
  if (imageUrlOrPath.startsWith("http://") || imageUrlOrPath.startsWith("https://")) {
    const res = await fetch(imageUrlOrPath);
    if (!res.ok) {
      throw new Error(`Failed to download image from URL (${res.status} ${res.statusText})`);
    }
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  }

  const cleanPath = imageUrlOrPath.startsWith("waste-images/")
    ? imageUrlOrPath.replace("waste-images/", "")
    : imageUrlOrPath.replace(/^\/+/, "");

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.storage.from(WASTE_IMAGES_BUCKET).download(cleanPath);

  if (error || !data) {
    throw new Error(`Failed to download image from Supabase Storage: ${error?.message || "File not found"}`);
  }

  const ab = await data.arrayBuffer();
  return Buffer.from(ab);
}
