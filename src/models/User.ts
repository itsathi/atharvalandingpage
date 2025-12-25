import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  role: { type: String, enum: ["admin", "user"], default: "admin" },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
