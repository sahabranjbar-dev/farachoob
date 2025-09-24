import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { randomUUID } from "crypto";

export const uploadFile = async (file: File, folder = "products") => {
  if (!file || file.size === 0) throw new Error("فایل معتبر نیست.");

  const ext = file.name.split(".").pop();
  const key = `${folder}/${Date.now()}-${randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3.send(command);

    // چند روش مختلف برای ساخت لینک دائمی
    const permanentUrl = `https://${process.env.LIARA_BUCKET_NAME}.storage.c2.liara.space/${key}`;

    console.log("File uploaded successfully:", permanentUrl);
    return permanentUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("آپلود فایل失敗 شد");
  }
};
