import mongoose from 'mongoose';

const ParkingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  totalAvailableParkings: { type: Number, required: true, min: 1, max: 8 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

export default mongoose.models.Parking || mongoose.model('Parking', ParkingSchema);