const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadProductImage(file) {
  if (!file) {
    throw new Error("No file selected for upload.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose a valid image file (JPG, PNG, WEBP, etc.).");
  }

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Missing VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET in environment variables."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "hastnirmit/products");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Failed to upload image.");
  }

  return data.secure_url;
}

export async function uploadProductImages(files) {
  const fileList = Array.from(files || []);
  if (!fileList.length) return [];

  return Promise.all(fileList.map((file) => uploadProductImage(file)));
}