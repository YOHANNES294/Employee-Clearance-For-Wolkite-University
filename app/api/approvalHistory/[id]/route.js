import { connectToDB } from "@/utils/database";
import History from "@/models/history";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const requests = await History.find({clearanceId: params.id });

    return new Response(JSON.stringify(requests), { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return new Response("Failed to fetch requests", { status: 500 });
  }
};