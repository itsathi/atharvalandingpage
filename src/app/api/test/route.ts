import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { connectDB } from "@/lib/connectDB";

export async function GET(request: NextRequest) {
    console.log("Attempting to connect to MongoDB...");
    try {
        await connectDB();
        console.log("MongoDB connected successfully");
        return NextResponse.json({ message: "MongoDB connected successfully" });
    } catch (error) {
            console.error("MongoDB connection failed:", error);
        return NextResponse.json({ message: "MongoDB connection failed", error: error?.toString() }, { status: 500 });
    }
}

