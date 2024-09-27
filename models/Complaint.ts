import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
});

export default mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);