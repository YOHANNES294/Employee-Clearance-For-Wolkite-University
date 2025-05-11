import { connectToDB } from '@/utils/database';
import RequestAccount from '@/models/RequestAccount';
import { sendRawDecisionEmail } from '@/utils/accountEmail';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { status, reason } = await req.json();
    
    // This stores and sends EXACTLY what you type
    await connectToDB();
    await RequestAccount.findByIdAndUpdate(id, {
      status,
      adminReason: reason, // Stores exactly as typed
      processedAt: new Date()
    });

    const request = await RequestAccount.findById(id);
    
    // Sends the raw, unmodified reason
    await sendRawDecisionEmail(
      request.email,
      request.firstname,
      status,
      reason // No changes to your text
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500 
    });
  }
}