const mongoose = require('mongoose');

const platformCommentUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'twitter', 'linkedin'],
    required: true,
  },
  windowStart: {
    type: Date,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

platformCommentUsageSchema.index({ userId: 1, platform: 1, windowStart: 1 }, { unique: true });

const PlatformCommentUsage = mongoose.model('PlatformCommentUsage', platformCommentUsageSchema);

module.exports = {PlatformCommentUsage};
