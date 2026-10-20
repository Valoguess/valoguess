import { UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { logger } from "@/lib/logger";

const getPublicIdFromUrl = (url: string) => {
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;

  const publicIdWithExtension = parts[1].replace(/^v\d+\//, '');

  const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
  
  return publicId;
};

export async function deleteImageByUrl(url: string) {
  try {
    const publicId = getPublicIdFromUrl(url);

    if (!publicId) {
      return;
    }
    
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (err) {
    logger.warn({ err, url }, "Failed to delete old image from Cloudinary");
  }
}

export async function uploadAvatarToCloudinary(file: File, userId: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "valoguess/users_avatars",
        public_id: `${userId}_avatar`,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
        transformation: [
          {
            width: 500,
            height: 500,
            crop: "fill",
            gravity: "center",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary returned no result"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });

  return result.secure_url;
}