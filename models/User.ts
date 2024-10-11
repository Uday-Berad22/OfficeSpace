import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  used_tokens:{ type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);