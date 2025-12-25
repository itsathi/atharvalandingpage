import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const body = await request.json();

  // next-cloudinary sends all parameters that need to be signed under `paramsToSign`
  const paramsToSign = {
    ...body.paramsToSign,
    // Use your explicit upload preset used in the widget
    upload_preset: "athilandingpage",
  };

  // Remove any undefined values
  Object.keys(paramsToSign).forEach((key) => {
    if (paramsToSign[key] === undefined) delete paramsToSign[key];
  });

  if (!process.env.CLOUDINARY_API_SECRET) {
    return new Response(
      JSON.stringify({
        error: "CLOUDINARY_API_SECRET environment variable is not set.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

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


