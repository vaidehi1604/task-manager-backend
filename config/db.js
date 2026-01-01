import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is missing from environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // ⏳ 10 sec timeout instead of hanging forever
    });

    console.log("🚀 MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:");
    console.error("Message:", err.message);

    // If Render can't reach MongoDB because of IP or password
    if (err.message.includes("ENOTFOUND")) {
      console.log("💡 Check: Is the cluster URL correct?");
    }
    if (err.message.includes("authentication")) {
      console.log("💡 Check: Username / Password may be wrong or not URL-encoded.");
    }
    if (err.message.includes("timed out")) {
      console.log("💡 Check: IP Whitelist (0.0.0.0/0) in MongoDB Atlas.");
    }

    process.exit(1);
  }
};

export default connectDB;
