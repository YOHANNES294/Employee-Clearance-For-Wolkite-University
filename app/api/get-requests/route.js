import { connectToDB } from "@/utils/database";
import Request from "@/models/Request";

export async function GET() {
  try {
    // Connecting to the database
    await connectToDB();
    
    // Fetching requests from the `requests` collection
    const requests = await Request.find({});
    
    // Returning the fetched requests
    return new Response(JSON.stringify({ requests }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to fetch requests" }), { status: 500 });
  }
}
