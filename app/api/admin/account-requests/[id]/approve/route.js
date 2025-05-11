import { sendRawDecisionEmail } from "@/utils/accountEmail";
import { connectToDB } from "@/utils/database";
import AccountRequest from "@/models/accountRequest";

export async function POST(request, { params }) {
  try {
    await connectToDB();
    const { username, password, reason } = await request.json();
    
    // Update the request status
    const updatedRequest = await AccountRequest.findByIdAndUpdate(
      params.id,
      { status: "approved" },
      { new: true }
    );

    if (!updatedRequest) {
      return new Response("Request not found", { status: 404 });
    }

    // Send approval email
    await sendRawDecisionEmail(
      updatedRequest.email,
      `${updatedRequest.firstname} ${updatedRequest.lastname}`,
      "approved",
      `Your account has been approved.\n\nUsername: ${username}\nTemporary Password: ${password}\n\n${reason}`
    );

    return new Response(JSON.stringify(updatedRequest), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}