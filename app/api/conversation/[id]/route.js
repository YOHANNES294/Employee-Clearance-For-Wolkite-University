import Conversation from "@/models/conversation";
import { connectToDB } from "@/utils/database";

// GET

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const conversation = await Conversation.find({
      members: { $in: [params.id] },
    });

    return new Response(JSON.stringify(conversation), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch conversation for user", {
      status: 500,
    });
  }
};
