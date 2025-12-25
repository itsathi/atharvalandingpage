import mongoose, { Connection } from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

let cachedConnection: Connection | null = null;

export const connectDB = async (): Promise<Connection> => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    cachedConnection = mongoose.connection;
    console.log("MongoDB connected successfully");
    return cachedConnection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};