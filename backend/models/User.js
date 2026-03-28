import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  location: String,
  nominee: String,
   platform_id: String,
  upi_id:String
});

export default mongoose.model("User", userSchema);