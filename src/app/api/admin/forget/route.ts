import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) return new Response("User not found", { status: 404 });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  // Configure your email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });

  return Response.json({ message: "Reset link sent" });
}
