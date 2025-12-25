import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression("folder:atharvalandingpage/*")
      .sort_by("public_id", "desc")
      .max_results(100)
      .execute();

    return NextResponse.json(result.resources);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load Cloudinary images" },
      { status: 500 }
    );
  }
}
