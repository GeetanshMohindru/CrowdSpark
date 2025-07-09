import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goal: { type: Number, required: true },
  deadline: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fundsRaised: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }, // New field
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);

