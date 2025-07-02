const mongoose = require('mongoose');

const {paginate} = require('./plugins/paginate');

const aiCommentSchema = new mongoose.Schema({
  text: String,
  status: {type: String, enum: ['suggested', 'commented', 'skipped', 'edited'], default: 'suggested'},
  editedText: String,
});

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    avatar: {
      type: {
        key: String,
        url: String,
      },
      default: null,
    },
    platform: {
      type: String,
      enum: ['instagram', 'facebook', 'twitter', 'linkedin'],
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: [String],
    hashtags: {
      type: [String],
      default: [],
    },
    mentions: {
      type: [String],
      default: [],
    },
    metadata: {
      type: Object,
      default: null,
    },
    interactions: {
      likes: {
        type: Number,
        default: 0,
      },
      comments: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    aiComments: [aiCommentSchema],
    commentGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.plugin(paginate);
postSchema.index({userId: 1, platform: 1, postId: 1}, {unique: true});

const Post = mongoose.model('Post', postSchema);

module.exports = {
  Post,
};
