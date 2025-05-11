import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Credential from "@/models/Credential";
import { sendCredentialsEmail } from "@/utils/emailSender";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { username, userpassword, email } = await req.json();

    // Validate input
    if (!username || !userpassword || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Connect to DB
    await connectToDB();

    // Hash password
    const hashedPassword = await bcrypt.hash(userpassword, 10);

    // Save credential (no duplicate checks)
    const newCredential = new Credential({
      username,
      userpassword: hashedPassword,
      email,
    });
    await newCredential.save();

    // Send the credentials to the employee's email
    await sendCredentialsEmail(email, username, userpassword);

    return NextResponse.json(
      { message: `Credential saved and email sent to ${email}` },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      { message: "Error", error: err.message },
      { status: 500 }
    );
  }
}
