import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export const uploadFile = async (file: File, folder = "products") => {
  if (!file || file.size === 0) throw new Error("فایل معتبر نیست.");

  const ext = file.name.split(".").pop();
  const key = `${folder}/${Date.now()}-${randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const command = new PutObjectCommand({
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await s3.send(command);

  const uploadedCommand = new GetObjectCommand({
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3, uploadedCommand);
  console.log({ url });

  return url;
};
