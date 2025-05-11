import { Schema, model, models } from "mongoose";

const AnnouncementSchema = new Schema({
  userId: {
    type: String,
    required: [true, "Id is required!"],
  },
  announcerName: {
    type: String,
   
  },
  title: {
    type: String,
    required: [true, "title is required!"],
  },
  description: {
    type: String,
    required: [true, "description is required!"],
  },

  announcementDate:{
    type:String,
    required: [true, "Requested date is required!"],
  },
  
  image: {
    type: String,
    required: [true, "image is required!"],
  },
});

const Announcement =models.Announcement || model("Announcement", AnnouncementSchema);

export default Announcement;
