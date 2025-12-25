import { NextRequest, NextResponse } from "next/server";
import Release from "@/models/release";
import { connectDB } from "@/lib/connectDB";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const releases = await Release.find({}).sort({ order: -1, createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: releases,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  try {
    const newRelease = new Release(body);
    const savedRelease = await newRelease.save();
    return NextResponse.json({ success: true, data: savedRelease });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  await connectDB();
  const requestBody = await request.json();
  const { id, ...updateData } = requestBody;

  try {
    const updatedRelease = await Release.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedRelease) {
      return NextResponse.json(
        { success: false, error: "Release not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedRelease,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  await connectDB();
  const requestBody = await request.json();
  const { id } = requestBody;

  try {
    const deletedRelease = await Release.findByIdAndDelete(id);

    if (!deletedRelease) {
      return NextResponse.json(
        { success: false, error: "Release not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedRelease,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}










