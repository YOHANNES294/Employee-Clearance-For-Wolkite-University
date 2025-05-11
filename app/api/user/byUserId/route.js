import User from "@/models/user"; // Check if the path to the user model is correct
import { connectToDB } from "@/utils/database";

export const GET = async (request) => {
    // Parse the stepType from the URL query parameters
    
      const params = new URL(request.url).searchParams;
      const userId = params.get("userId");
  
     
  try {
    await connectToDB();
    const user = await User.find({ userId: userId });
    
    // Send JSON response directly using res.json()
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    // Send error response
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
