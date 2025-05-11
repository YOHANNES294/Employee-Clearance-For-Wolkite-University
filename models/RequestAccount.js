/*import mongoose from 'mongoose';

const requestAccountSchema = new mongoose.Schema({
  // Required fields for employee matching
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  firstname: { type: String, required: true },
  middlename: { type: String, required: true },
  staffId: { type: String, required: true },
  staffType: { 
    type: String, 
    required: true,
    enum: ['academic', 'admin']
  },
  
  // Optional fields
  lastname: String,
  collegeName: String,
  departmentName: String,
  officeName: String,
  telephone: String,
  blockNo: String,
  email: String,
  
  // Status fields
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedAt: { type: Date, default: Date.now }
});

export default mongoose.models.RequestAccount || 
       mongoose.model('RequestAccount', requestAccountSchema);

*/
import mongoose from 'mongoose';

const requestAccountSchema = new mongoose.Schema({
  // Required fields for employee matching
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee', 
    required: true 
  },
  firstname: { 
    type: String, 
    required: true 
  },
  middlename: { 
    type: String, 
    required: true 
  },
  staffId: { 
    type: String, 
    required: true 
  },
  staffType: { 
    type: String, 
    required: true,
    enum: ['academic', 'admin']
  },
  
  // Optional fields
  lastname: String,
  collegeName: String,
  departmentName: String,
  officeName: String,
  telephone: String,
  blockNo: String,
  email: String,
  
  // Status fields
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminReason: String, // Stores the reason for approval/rejection
  requestedAt: { 
    type: Date, 
    default: Date.now 
  },
  processedAt: Date // When decision was made
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Check if model already exists before creating it
const RequestAccount = mongoose.models.RequestAccount || 
                      mongoose.model('RequestAccount', requestAccountSchema);

export default RequestAccount;       