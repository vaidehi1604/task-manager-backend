import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is missing in environment variables. Check Render settings.");
    }

    console.log("🔍 Connecting to MongoDB...");
    // Log part of URI to confirm it is being read
    console.log("🔗 Mongo Host:", process.env.MONGO_URI.split("@")[1].split("/")[0]);

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 12000, // 12s timeout to prevent hanging forever
    });

    console.log("🍃 MongoDB Connected Successfully! 🚀");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:");
    console.error("📌 Message:", err.message);

    if (err.message.includes("ENOTFOUND")) {
      console.log("⚠️  Check: cluster address might be wrong or typo in the URI.");
    }
    if (err.message.includes("authentication")) {
      console.log("⚠️  Check: username/password might be incorrect or not URL encoded.");
    }
    if (err.message.includes("timed out")) {
      console.log("⚠️  Check: MongoDB not reachable → Verify 0.0.0.0/0 IP is whitelisted.");
    }

    process.exit(1);
  }
};

export default connectDB;
