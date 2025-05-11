import { connectToDB } from "@/utils/database";
import Notification from "@/models/notification";
import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";

export async function POST(req) {
  try {
    const { senderId, receiverId, type, notificationId } = await req.json();
    await connectToDB();

    // Create a new Notification instance
    const newNotification = new Notification({
      senderId,
      receiverId,
      type,
      notificationId,
    });

    // Save the notification to MongoDB
    const savedNotification = await newNotification.save();

    return NextResponse.json(savedNotification, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while creating the notification." },
      { status: 500 }
    );
  }
}
