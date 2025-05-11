import { connectToDB } from '@/utils/database';
import RequestAccount from '@/models/RequestAccount';

export async function GET(request) {
  try {
    await connectToDB();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Build filter object
    const filter = {};
    
    // Text filters (exact match)
    if (params.staffId) filter.staffId = params.staffId;
    if (params.staffType) filter.staffType = params.staffType;
    if (params.status) filter.status = params.status;
    
    // Text search (partial match)
    if (params.search) {
      filter.$or = [
        { firstname: { $regex: params.search, $options: 'i' } },
        { lastname: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } }
      ];
    }
    
    // Date range filter
    if (params.startDate || params.endDate) {
      filter.requestedAt = {};
      if (params.startDate) filter.requestedAt.$gte = new Date(params.startDate);
      if (params.endDate) filter.requestedAt.$lte = new Date(params.endDate);
    }

    const requests = await RequestAccount.find(filter)
      .sort({ requestedAt: -1 })
      .select('-__v');

    return new Response(JSON.stringify(requests), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500 
    });
  }
}