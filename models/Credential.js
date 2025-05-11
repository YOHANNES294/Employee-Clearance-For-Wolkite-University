import mongoose from "mongoose";

const CredentialSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // unique: true <-- REMOVE THIS
  },
  userpassword: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Credential || mongoose.model("Credential", CredentialSchema);
