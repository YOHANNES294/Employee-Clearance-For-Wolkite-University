import { connectToDB } from "@/utils/database";

import bcrypt from "bcryptjs";
import Announcement from "@/models/announcement";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async (req) => {
  const { title, description, image } = await req.json();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.userId;
  const announceFirstName = session?.user?.firstname;
  const announcerMiddleName = session?.user?.middlename;
  const announcerLastName = session?.user?.lastname;
  const announcerName = announceFirstName + " " + announcerMiddleName;
  // Get the current date
  const today = new Date();

  // Format the date as "DD/MM/YY"
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  //   const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await connectToDB();
    const newAnnouncement = new Announcement({
      userId,
      announcerName: announcerName,
      title,
      description,
      image,
      announcementDate: formattedDate,
    });

    await newAnnouncement.save();
    return new Response(JSON.stringify(newAnnouncement), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new announcement", { status: 500 });
  }
};

export const GET = async () => {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch all users from the database
    const announcement = await Announcement.find();
    // Return a success response with the users data
    return new Response(JSON.stringify(announcement), { status: 200 });
  } catch (error) {
    console.error("Error fetching announcement:", error);

    // Return an error response
    return new Response("Failed to fetch announcement", { status: 500 });
  }
};
