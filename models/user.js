import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  userId: {
    type: String,
    unique: [true, "ID already exists!"],
    required: [true, "ID is required!"],
  },
  firstname: {
    type: String,
    required: [true, "First name is required!"],
  },
  middlename: {
    type: String,
    required: [true, "Middle name is required!"],
  },
  lastname: {
    type: String,
    required: [true, "Last name is required!"],
  },
  password: {
    type: String,
  },
  collegeName: {
    type: String,
  },
  departmentName: {
    type: String,
  },
  officename: {
    type: String,
  },
  image: {
    type: String,
  },
  year: {
    type: String,
  },
  role: {
    type: String,
  },
  privilege: {
    type: String,
  },
  email: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  blockNo: {
    type: String,
  },
  status: {
    type: String,
    default: "active",
  },
  emailResetPassword: {
    type: String,
  },
  verificationCode: {
    type: String,
  },
  director: {
    type: String,
  },
  staffType: {
    type: String,
  },
  passwordResetTokenExpires: { type: Date, default: null },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model("User", UserSchema);
export default User;
