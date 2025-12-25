import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const body = await request.json();

  // next-cloudinary sends all parameters that need to be signed under `paramsToSign`
  // so we just use them directly and add `upload_preset` if missing
  const paramsToSign = {
    ...body.paramsToSign,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
  };

  // Remove any undefined values
  Object.keys(paramsToSign).forEach((key) => {
    if (paramsToSign[key] === undefined) delete paramsToSign[key];
  });

  // Ensure CLOUDINARY_API_SECRET is defined
  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_SECRET environment variable is not set.");
  }

  // Create signature
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return new Response(
    JSON.stringify({
      signature,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
