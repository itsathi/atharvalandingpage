import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  }, 
  aboutbio:{
    type: String,
    required: false
  },
  aboutcard1:{
    type: String,
    required: false
  },
  aboutcard2:{
    type: String,
    required: false
  }
})

export const Content = mongoose.models.Content || mongoose.model("Content", contentSchema);

export default Content;
