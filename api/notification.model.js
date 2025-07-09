import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['funding', 'comment', 'admin', 'campaign_approved', 'campaign_rejected', 'info'], 
    default: 'info' 
  },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  read: { type: Boolean, default: false },
  image: { type: String },
  avatar: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('Notification', notificationSchema);

