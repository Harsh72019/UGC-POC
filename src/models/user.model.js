const mongoose = require('mongoose');
const {paginate} = require('./plugins/paginate');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    socialAccounts: [String],
    interests: [String],
    goals: String,
    gender: String,
    email: {
      type: String,
      trim: true,
      
    },
    profilePic: {
      type: {
        key: String,
        url: String,
      },
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    firebaseUid: {
      type: String,
      
      unique: true,
    },
    firebaseSignInProvider: {
      type: String,
      
    },
    appNotificationsLastSeenAt: {
      type: Date,
      default: Date.now,
    },

    threadId: {
      type: String,
      default: null,
    },

    aiCommentFeedback: [{
      original: String,
      edited: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    step : {
      type: Number,
      default: 1,
    },
    isOnboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  if (update.step === 3 || (update.$set && update.$set.step === 3)) {
    this.findOneAndUpdate({}, { $set: { isOnboardingCompleted: true } });
  }
  else{
    this.findOneAndUpdate({}, { $set: { isOnboardingCompleted: false } });
  }

  next();
});


const clientSchema = new mongoose.Schema(
  {
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      // to soft delete user. if(isDeleted = true), then user is deleted.
      type: Boolean,
      default: false,
    },
    preferences: {
      type: {
        notificationEnabled: Boolean,
        locationShared: Boolean,
      },
      default: {
        notificationEnabled: false,
        locationShared: false,
      },
    },
  },
  {timestamps: true}
);

userSchema.plugin(paginate);
clientSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);
const Client = User.discriminator('Client', clientSchema);

module.exports = {
  User,
  Client,
};
