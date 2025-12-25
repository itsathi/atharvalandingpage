import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: Request) {
  try {
    const { public_id } = await req.json();

    if (!public_id)
      return NextResponse.json({ error: "public_id required" }, { status: 400 });

    const result = await cloudinary.uploader.destroy(public_id);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
