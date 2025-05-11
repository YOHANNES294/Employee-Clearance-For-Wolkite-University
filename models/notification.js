import mongoose, { Schema, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    senderId: {
      type: String,
    },
    receiverId: {
      type: String,
    },
    type: {
      type: String,
    },
    notificationId: {
      type: String,
    },
    isChecked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification =
  models.Notification || mongoose.model("Notification", NotificationSchema);
export default Notification;
