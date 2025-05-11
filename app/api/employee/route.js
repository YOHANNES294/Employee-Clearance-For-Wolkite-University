import { NextResponse } from 'next/server';
import Employee from '@/models/Employee';
import { connectToDB } from '@/utils/database';

// Helper for error responses
const errorResponse = (message, status = 400) => {
  return NextResponse.json({ error: message }, { status });
};

export async function GET() {
  try {
    await connectToDB();
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    return NextResponse.json(employees);
  } catch (error) {
    return errorResponse('Failed to fetch employees', 500);
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const { firstname, middlename, staffId, staffType } = await request.json();

    if (!firstname || !staffId) {
      return errorResponse('First name and Staff ID are required');
    }

    const exists = await Employee.findOne({ staffId });
    if (exists) return errorResponse('Staff ID already exists');

    const newEmployee = new Employee({
      firstname,
      middlename: middlename || undefined,
      staffId,
      staffType
    });

    await newEmployee.save();
    return NextResponse.json({
      success: true,
      data: newEmployee
    }, { status: 201 });

  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

export async function PATCH(request) {
  try {
    await connectToDB();
    const { id, ...updateData } = await request.json();
    
    const updated = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) return errorResponse('Employee not found', 404);
    return NextResponse.json({ success: true, data: updated });

  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(request) {
  try {
    await connectToDB();
    const { id } = await request.json();
    const deleted = await Employee.findByIdAndDelete(id);
    
    if (!deleted) return errorResponse('Employee not found', 404);
    return NextResponse.json({ success: true });

  } catch (error) {
    return errorResponse(error.message, 500);
  }
}