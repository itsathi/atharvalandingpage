// /models/ImageSlot.js
import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
  logo: { url: String, public_id: String },
  catrel: { url: String, public_id: String },
  lamp: { url: String, public_id: String },
  youtube: { url: String, public_id: String },
  card1: { url: String, public_id: String },
  card2: { url: String, public_id: String },
});

export default mongoose.models.ImageSlot ||
  mongoose.model("ImageSlot", SlotSchema);
