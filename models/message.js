import mongoose, { Schema, models } from "mongoose";

const MessageSchema = new Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = models.Message || mongoose.model("Message", MessageSchema);
export default Message;
