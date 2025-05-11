import { NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database';
import Employee from '@/models/Employee';
import RequestAccount from '@/models/RequestAccount';

export async function POST(req) {
  try {
    await connectToDB();
    
    const requestData = await req.json();
    
    // Validate required fields for matching employee
    const requiredMatchFields = ['firstname', 'middlename', 'staffId', 'staffType'];
    const missingMatchFields = requiredMatchFields.filter(field => !requestData[field]?.trim());
    
    if (missingMatchFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields for verification: ${missingMatchFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Find matching employee (case-insensitive for names)
    const employee = await Employee.findOne({
      $and: [
        { firstname: { $regex: new RegExp(`^${requestData.firstname.trim()}$`, 'i') }},
        { middlename: { $regex: new RegExp(`^${requestData.middlename.trim()}$`, 'i') }},
        { staffId: requestData.staffId.trim() },
        { staffType: requestData.staffType.trim() }
      ]
    }).collation({ locale: 'en', strength: 2 });

    if (!employee) {
      return NextResponse.json(
        { 
          success: false,
          message: "Employee not found. Please verify your first name, middle name, staff ID, and staff type match our records."
        },
        { status: 404 }
      );
    }

    // Check for existing pending request
    const existingRequest = await RequestAccount.findOne({
      staffId: requestData.staffId,
      status: 'pending'
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, message: "A pending request already exists for this staff ID" },
        { status: 400 }
      );
    }

    // Create new request - only require matching fields, others optional
    const newRequest = new RequestAccount({
      // Required matching fields
      firstname: requestData.firstname.trim(),
      middlename: requestData.middlename.trim(),
      staffId: requestData.staffId.trim(),
      staffType: requestData.staffType.trim(),
      employeeId: employee._id,
      
      // Optional fields
      lastname: requestData.lastname?.trim(),
      collegeName: requestData.collegeName?.trim(),
      departmentName: requestData.departmentName?.trim(),
      officeName: requestData.officeName?.trim(),
      telephone: requestData.telephone?.trim(),
      blockNo: requestData.blockNo?.trim(),
      email: requestData.email?.trim(),
      
      // Status fields
      status: 'pending',
      requestedAt: new Date()
    });

    await newRequest.save();

    return NextResponse.json(
      { 
        success: true, 
        message: "Request submitted successfully",
        requestId: newRequest._id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || "Internal server error" 
      },
      { status: 500 }
    );
  }
}