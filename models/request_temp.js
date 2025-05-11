// models/Request.js
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  middlename: { type: String, required: true },
  lastname: { type: String, required: true },
  collegeName: { type: String, required: true },
  departmentName: { type: String, required: true },
  staffId: { type: String, required: true },
  officeName: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  blockNo: { type: String, required: true },
  clearanceType: { type: String, required: true },
}, { timestamps: true });

const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);

export default Request;
