import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  await connectDB();

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return new Response("Invalid or expired token", { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return Response.json({ message: "Password updated" });
}
