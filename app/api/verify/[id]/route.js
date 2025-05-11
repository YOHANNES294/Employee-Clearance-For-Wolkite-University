// app/api/verify/[id]/route.js
import { connectToDB } from '@utils/database';
import History from '@models/history';

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    
    const certificate = await History.findById(params.id);
    
    if (!certificate) {
      return new Response(JSON.stringify({ 
        valid: false, 
        error: "Certificate not found" 
      }), { status: 404 });
    }

    return new Response(JSON.stringify({
      valid: true,
      certificate: {
        id: certificate._id,
        name: `${certificate.firstname} ${certificate.middlename}`,
        dateApproved: certificate.dateApproved,
        status: certificate.status
      }
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ 
      valid: false, 
      error: "Verification failed" 
    }), { status: 500 });
  }
}