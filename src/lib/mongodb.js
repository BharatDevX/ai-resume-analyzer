import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("❌ MONGODB_URL is not defined in env");
}

// Global cache (VERY IMPORTANT for Next.js)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        bufferCommands: false, // ✅ IMPORTANT
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
