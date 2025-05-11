import { Schema, model, models } from "mongoose";

const OfficeSchema = new Schema({
  officeId: {
    type: String,
    unique: [true, "ID already exists!"],
    required: [true, "Id is required!"],
  },
  officeName: {
    type: String,
    required: [true, "officeName is required"],
  },

  password: {
    type: String,
  },

  location: {
    type: String,
    required: [true, "location is required"],
  },
  items: {
    type: String,
    required: [true, "items is required"],
  },
  type: {
    type: String,
    required: [true, "step type is required"],
  },
  status:{
    type:String,
    required:[true,"status is required"],
  }
});

const Office = models.Office || model("Office", OfficeSchema);
export default Office;
