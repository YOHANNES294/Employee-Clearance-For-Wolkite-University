import { connectToDB } from '@/utils/database';
import RequestAccount from '@/models/RequestAccount';
import { sendDecisionEmail } from '@/utils/accountEmail';

export async function PUT(req, { params }) {
  try {
    // 1. Get data from request
    const { decision, reason } = await req.json();
    const { id } = params;

    // 2. Connect to database
    await connectToDB();

    // 3. Find and update request
    const updatedRequest = await RequestAccount.findByIdAndUpdate(
      id,
      {
        status: decision,
        adminReason: reason,
        processedAt: new Date()
      },
      { new: true } // Return updated document
    );

    if (!updatedRequest) {
      return new Response("Request not found", { status: 404 });
    }

    // 4. Send email
    await sendDecisionEmail(
      updatedRequest.email,
      updatedRequest.firstname,
      decision,
      reason
    );

    return new Response(JSON.stringify(updatedRequest), { status: 200 });

  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}