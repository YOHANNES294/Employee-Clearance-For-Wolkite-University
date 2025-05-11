import { connectToDB } from "@/utils/database";
import History from "@/models/history";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/user";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.userId;

  // Fetch privilege from user table for mapping
  const fetchUser = await User.find({ userId: userId });
  const privilege = fetchUser[0].privilege;

  try {
    await connectToDB();
    let requests;
    if (privilege == "Human Resource Management Directorate") {
      requests = await History.find({ role: "STAFF" }).sort({ dateApproved: -1 });
    } else {
      // Handle case where the user doesn't have the necessary privilege
      return new Response("Unauthorized", { status: 403 });
    }

    // Return a success response with the users data
    return new Response(JSON.stringify(requests), { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);

    // Return an error response
    return new Response("Failed to fetch requests", { status: 500 });
  }
};