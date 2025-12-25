import mongoose from "mongoose";

const releaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  album: {
    type: String,
    required: false,
    trim: true,
  },
  artist: {
    type: String,
    required: false,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: false,
    trim: true,
  },
  spotifyUrl: {
    type: String,
    required: false,
    trim: true,
  },
  appleMusicUrl: {
    type: String,
    required: false,
    trim: true,
  },
  youtubeUrl: {
    type: String,
    required: false,
    trim: true,
  },
  bandcampUrl: {
    type: String,
    required: false,
    trim: true,
  },
  releaseDate: {
    type: Date,
    required: false,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export const Release =
  mongoose.models.Release || mongoose.model("Release", releaseSchema);

export default Release;










