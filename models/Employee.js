import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  firstname: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true
  },
  middlename: {
    type: String,
    trim: true
  },
  staffId: {
    type: String,
    required: [true, 'Staff ID is required'],
    unique: true,
    trim: true
  },
  staffType: {
    type: String,
    required: true,
    enum: ['Admin', 'Academic'],
    default: 'Academic'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
export default Employee;