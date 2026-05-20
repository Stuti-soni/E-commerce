import mongoose from "mongoose";

export async function initMongoose() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  if (!process.env.MONGODB_URL) throw new Error('MONGODB_URL env var is not set');
  return await mongoose.connect(process.env.MONGODB_URL);
}