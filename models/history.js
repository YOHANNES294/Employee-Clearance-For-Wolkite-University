import { Schema, model, models } from "mongoose";

const HistorySchema = new Schema({
  userId: {
    type: String,
    required: [true, "Id is required!"],
  },
  reason: {
    type: String,
    required: [true, "Reason is required!"],
  },
  status: {
    type: String,
    required: [true, "Status is required!"],
  },
  firstname: {
    type: String,
    required: [true, "firstname is required!"],
  },
  middlename: {
    type: String,
    required: [true, "middlename is required!"],
  },
  dateRequested:{
    type:String,
    required: [true, "Requested date is required!"],
  },
  dateApproved:{
    type:String,
    required: [true, "Approved date is required!"],
  },
  clearanceId:{
    type:String,
    required: [true, "Approved date is required!"],
  },
  role: {
    type: String,
    required: [true, "role is required!"],
  },
  staffType: {
    type: String,
    
  },
});

const History =models.History || model("History", HistorySchema);

export default History;
