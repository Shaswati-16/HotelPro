const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_CONNECTION_LINK;
  if (!uri) {
    throw new Error("MONGODB_CONNECTION_LINK is missing. Add it to server/.env");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB successfully");

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });
  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected. Mongoose will try to reconnect automatically.");
  });
};

module.exports = connectDB;
