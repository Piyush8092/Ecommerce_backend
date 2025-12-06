const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        `mongodb+srv://softerinttechnology:Softerintt123@cluster0.f9f6mkg.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`,
      {
        serverSelectionTimeoutMS: 5000,
      }
    );
    console.log("MongoDB connected");
  } catch (e) {
    console.error("MongoDB connection error:", e.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = connectDB;
