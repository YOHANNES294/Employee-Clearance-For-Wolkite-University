import Message from "@/models/message";
import { connectToDB } from "@/utils/database";

// GET

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const messages = await Message.find({
      conversationId: params.id,
    });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch Message for user", {
      status: 500,
    });
  }
};
