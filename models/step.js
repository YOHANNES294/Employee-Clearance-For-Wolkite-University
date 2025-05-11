import { Schema, model, models } from "mongoose";

const StepSchema = new Schema({
  userId: {
    type: String,
    // required: [true, "Id is required!"],
  },
  steps: {
    type:Array,
    required: [true, "Array is required!"],
  },
  stepType: {
    type: String,
    // required: [true, "stepType is required!"],
  },
});

const Step =models.Step || model("Step", StepSchema);

export default Step;
