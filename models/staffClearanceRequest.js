import { Schema, model, models } from "mongoose";

const StaffRequestSchema = new Schema({
  userId: {
    type: String,
    required: [true, "Id is required!"],
  },
  reason: {
    type: String,
    required: [true, "Reason is required!"],
  },
  attachedFile: { type: String },
  status: {
    type: [String],
    required: [true, "Status is required!"],
  },
  approvals: [
    {
      role: String,
      time: Date,
    },
  ],
  rejections: {
    type: Array,
  },
  firstname: {
    type: String,
    required: [true, "firstname is required!"],
  },
  middlename: {
    type: String,
    required: [true, "middlename is required!"],
  },
  privilege: {
    type: String,
    // required: [true, "privilege is required!"],
  },
  staffType: {
    type: String,
    // required: [true, "privilege is required!"],
  },
  director: {
    type: String,
  },
  collegeName: {
    type: String,
    // required: [true, "collegeId is required!"],
  },
  departmentName: {
    type: String,
    // required: [true, "departmentId is required!"],
  },
  guarantorName: {
    type: String,
  },
  guarantorId: {
    type: String,
  },
  _userId: {
    type: String,
  },
  role: {
    type: String,
    required: [true, "role is required!"],
  },
  dateRequested: {
    type: String,
    required: [true, "Requested date is required!"],
  },
});

const StaffClearnceReq =
  models.StaffClearnceReq || model("StaffClearnceReq", StaffRequestSchema);

export default StaffClearnceReq;
