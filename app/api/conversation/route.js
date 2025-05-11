import { connectToDB } from "@/utils/database";
import Conversation from "@/models/conversation";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req) {
  // const session = await getServerSession(authOptions);
  // const senderId = session?.user?.UserId;
  try {
    const { senderId, receiverId } = await req.json();
    await connectToDB();

    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });

    const savedConversation = await newConversation.save();

    return NextResponse.json(savedConversation, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while creating the conversation." },
      { status: 500 }
    );
  }
}
