import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  location: String,
  nominee: String
});

export default mongoose.model("User", userSchema);