import { connectToDB } from "@/utils/database";
import History from "@/models/history";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.userId;

  try {
    await connectToDB();

    const requests = await History.find({ userId: userId }).sort({ dateApproved: -1 });

    // Return a success response with the users data
    return new Response(JSON.stringify(requests), { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);

    // Return an error response
    return new Response("Failed to fetch requests", { status: 500 });
  }
};
