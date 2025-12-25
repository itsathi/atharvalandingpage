import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // Import helper to read cookies

export async function POST(req: Request) {
  try {
    // 1. CHECK FOR LOGGED-IN ADMIN
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // 2. VERIFY THE TOKEN
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    // 3. PROCEED WITH REGISTRATION
    const { name, email, password } = await req.json();
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role: "admin" 
    });

    return NextResponse.json({ 
      message: "New admin created by " + decoded.email, 
      user: { name: user.name, email: user.email } 
    });

  } catch (err) {
    return NextResponse.json({ message: "Session expired or invalid" }, { status: 401 });
  }
}