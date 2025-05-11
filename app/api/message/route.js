import { connectToDB } from "@/utils/database";

import Message from "@/models/message";

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { conversationId, sender, text } = await req.json();
    await connectToDB();

    //const newMessage = new Message(req.body);

    const newMessage = new Message({
      conversationId: conversationId,
      sender: sender,
      text: text,
    });

    const savedMessage = await newMessage.save();

    return NextResponse.json(savedMessage, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while creating the Message." },
      { status: 500 }
    );
  }
}
