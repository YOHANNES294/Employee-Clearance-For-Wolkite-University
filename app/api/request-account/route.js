import { NextResponse } from 'next/server';
import dbConnect from '@/app/models/db';
import Request from '@/app/models/Request';

export async function POST(req) {
  try {
    await dbConnect();
    
    const requestData = await req.json();

    // Check for existing request with same staffId
    const existingRequest = await Request.findOne({ 
      staffId: requestData.staffId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingRequest) {
      return NextResponse.json(
        { 
          success: false,
          message: existingRequest.status === 'approved' 
            ? 'This staff already has an active account' 
            : 'You already have a pending request'
        },
        { status: 400 }
      );
    }

    // Create new request with only the submitted fields
    const newRequest = new Request(requestData);
    await newRequest.save();

    return NextResponse.json(
      { 
        success: true,
        message: 'Request submitted successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Request submission error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to submit request'
      },
      { status: 500 }
    );
  }
}