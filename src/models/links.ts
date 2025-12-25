import mongoose from "mongoose";

const linksSchema = new mongoose.Schema({
  spotify: {
    type: String,
    required: false,
    trim: true,
  },
  applemusic: {
    type: String,
    required: false,
    trim: true,
  },
  itunes: {
    type: String,
    required: false,
    trim: true,
  },
  bandcamp: {
    type: String,
    required: false,
    trim: true,
  },
  twitter: { // lowercased property name
    type: String,
    required: false,
    trim: true,
  },
  facebook: {
    type: String,
    required: false,
    trim: true,
  },
  instagram: {
    type: String,
    required: false,
    trim: true,
  },
  youtubevideo: { // lowercased property name
    type: String,
    required: false,
    trim: true,
  },
  youtubechannel: { // lowercased property name
    type: String,
    required: false,
    trim: true,
  },
});

// Model name capitalized, matches Mongoose best practices
export const Links =
  mongoose.models.Links || mongoose.model("Links", linksSchema);

export default Links;
