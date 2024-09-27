import mongoose from 'mongoose';

const CarPoolSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  date: { type: Date, required: true },
  route: { type: String, required: true },
});

export default mongoose.models.CarPool || mongoose.model('CarPool', CarPoolSchema);