import { connectToDB } from '@/utils/database';
import RequestAccount from '@/models/RequestAccount';

export async function GET() {
  try {
    await connectToDB();
    const requests = await RequestAccount.find().sort({ requestedAt: -1 });
    return Response.json(requests);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    await connectToDB();
    const updated = await RequestAccount.findByIdAndUpdate(
      id, 
      { status },
      { new: true }
    );

    if (!updated) {
      return Response.json({ error: "Request not found" }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}