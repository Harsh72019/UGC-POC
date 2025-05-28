const Joi = require('joi');

const register = {
  body: Joi.object().keys({
    name: Joi.string().trim().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    phone: Joi.string().trim().optional(),
    dob: Joi.date().iso().optional().allow(null),
    email: Joi.string().email().trim().optional(),
    firebaseUid: Joi.string().optional().allow(null),
    firebaseSignInProvider: Joi.string().optional().allow(null),
    profilePic: Joi.object({
      key: Joi.string().required(),
      url: Joi.string().uri().required(),
    }).optional().allow(null),
     socialAccounts: Joi.object().pattern(
      Joi.string().valid('instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'),
      Joi.string()
    ).optional(),
    interests: Joi.array().items(Joi.string()).optional(),
    goals: Joi.string().optional().allow('', null),
    threadId: Joi.string().optional().allow(null),
    appNotificationsLastSeenAt: Joi.date().optional(),
  }),
};



module.exports = {
  register,
};