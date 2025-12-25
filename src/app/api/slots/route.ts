// /app/api/slots/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import ImageSlot from "@/models/ImageSlot";

// -------------------------
// GET — fetch all slots
// -------------------------
export async function GET() {
  try {
    await connectDB();

    let doc = await ImageSlot.findOne().lean();

    if (!doc) {
      const createdDoc = await ImageSlot.create({});
      doc = createdDoc.toObject();
    }

    return NextResponse.json(doc);
  } catch (err) {
    return NextResponse.json(
      { message: "GET error", error: String(err) },
      { status: 500 }
    );
  }
}

// -------------------------
// PUT — update single slot
// -------------------------
export async function PUT(req: Request) {
  try {
    await connectDB();

    const { slotKey, url, public_id } = await req.json();
    if (!slotKey || !url || !public_id) {
      return NextResponse.json(
        { error: "slotKey, url & public_id are required" },
        { status: 400 }
      );
    }

    const updateData = {
      [slotKey]: { url, public_id },
    };

    const doc = await ImageSlot.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    }).lean();

    return NextResponse.json({ success: true, updated: doc });
  } catch (err) {
    return NextResponse.json(
      { message: "PUT error", error: String(err) },
      { status: 500 }
    );
  }
}

// -------------------------
// DELETE — clear slot
// -------------------------
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slotKey = searchParams.get("slotKey");

    if (!slotKey) {
      return NextResponse.json(
        { error: "slotKey is required" },
        { status: 400 }
      );
    }

    const empty = {
      [slotKey]: { url: "", public_id: "" },
    };

    const doc = await ImageSlot.findOneAndUpdate({}, empty, {
      new: true,
      upsert: true,
    }).lean();

    return NextResponse.json({ success: true, data: doc });
  } catch (err) {
    return NextResponse.json(
      { message: "DELETE error", error: String(err) },
      { status: 500 }
    );
  }
}
