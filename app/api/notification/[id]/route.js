import Notification from "@/models/notification";
import { connectToDB } from "@/utils/database";

// GET

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const notifications = await Notification.find({
      receiverId: params.id,
    });

    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch Notification for user", {
      status: 500,
    });
  }
};

export const PATCH = async (request, { params }) => {
  try {
    await connectToDB();
    const userId = params.id;
    const result = await Notification.updateMany(
      { receiverId: userId, isChecked: false },
      { $set: { isChecked: true } }
    );

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
};
