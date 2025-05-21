const Joi = require('joi');

const register = {
  body: Joi.object().keys({
    name: Joi.string().trim().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    phone: Joi.string().trim().optional().allow(null),
    dob: Joi.date().iso().optional().allow(null),
    email: Joi.string().email().trim().required(),
    firebaseUid: Joi.string().optional().allow(null),
    firebaseSignInProvider: Joi.string().optional().allow(null),
    profilePic: Joi.object({
      key: Joi.string().required(),
      url: Joi.string().uri().required(),
    }).optional().allow(null),
    socialAccounts: Joi.array().items(Joi.string()).optional(),
    interests: Joi.array().items(Joi.string()).optional(),
    goals: Joi.string().optional().allow('', null),
    threadId: Joi.string().optional().allow(null),
    appNotificationsLastSeenAt: Joi.date().optional(),
  }),
};


module.exports = {
  register,
};