import mongoose, { Schema, models } from "mongoose";

const ConversationSchema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Conversation =
  models.Conversation || mongoose.model("Conversation", ConversationSchema);
export default Conversation;
