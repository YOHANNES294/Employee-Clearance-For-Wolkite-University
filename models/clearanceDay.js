import { Schema, model, models } from "mongoose";

const ClearanceDaySchema = new Schema({
  day: {
    type: Number,
    required: [true, "Day is required"],
  },
});

const ClearanceDay = models.ClearanceDay || model("ClearanceDay", ClearanceDaySchema);

export default ClearanceDay;
