import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  distance: { type: Number, required: true }, // Distance from office in km
  tokens: { type: Number, default: 2 }, // Weekly tokens
  monthlyTokens: { type: Number, default: 5 }, // Monthly tokens
});

export default mongoose.models.User || mongoose.model('User', UserSchema);