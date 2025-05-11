// app/api/employee/validate/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database';
import Employee from '@/models/Employee';
import RequestAccount from '@/models/RequestAccount';

export async function POST(req) {
  try {
    await connectToDB();
    
    const requestData = await req.json();
    
    // Validate required fields
    if (!requestData.firstname || !requestData.staffId || !requestData.clearanceType) {
      return NextResponse.json(
        { isValid: false, message: "First Name, Staff ID, and Clearance Type are required" },
        { status: 400 }
      );
    }

    // Clean and trim input data
    const cleanData = {
      firstname: requestData.firstname.trim(),
      staffId: requestData.staffId.trim(),
      clearanceType: requestData.clearanceType.trim()
    };

    // Find employee (case-insensitive)
    const employee = await Employee.findOne({
      $and: [
        { firstname: { $regex: new RegExp(`^${cleanData.firstname}$`, 'i') }},
        { staffId: cleanData.staffId },
        { staffType: cleanData.clearanceType }
      ]
    }).collation({ locale: 'en', strength: 2 });

    if (!employee) {
      return NextResponse.json(
        { 
          isValid: false,
          message: "Employee not found. Please verify your details match our records exactly."
        },
        { status: 404 }
      );
    }

    // Create request with all data
    const newRequest = new RequestAccount({
      ...requestData,
      employeeId: employee._id,
      status: 'pending'
    });

    await newRequest.save();

    return NextResponse.json(
      { isValid: true, message: "Request submitted successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error('Server Error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { isValid: false, message: "A request with this Staff ID already exists" },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { isValid: false, message: `Validation error: ${messages.join(', ')}` },
        { status: 400 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { 
        isValid: false,
        message: "An unexpected error occurred. Please try again later."
      },
      { status: 500 }
    );
  }
}