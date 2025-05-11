import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export async function GET() {
    try {
      // Connect to the database
      await connectToDB();
  
      // Fetch all users from the database
      const users = await User.find({ role: "ADMIN" });
  
      // Return a success response with the users data
      return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
      console.error("Error fetching users:", error);
  
      // Return an error response
      return new Response("Failed to fetch users", { status: 500 });
    }
  }

  
  