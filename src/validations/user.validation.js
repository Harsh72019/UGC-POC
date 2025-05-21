const Joi = require('joi');
const { objectId } = require('./custom.validation');

const updateUser = {
  body: Joi.object().keys({
    name: Joi.string().trim().optional(),
    phone: Joi.string().trim().optional().allow(null),
    dob: Joi.date().iso().optional().allow(null),
    email: Joi.string().email().trim().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    profilePic: Joi.object({
      key: Joi.string().required(),
      url: Joi.string().uri().required(),
    }).optional().allow(null),
    interests: Joi.array().items(Joi.string()).optional(),
    goals: Joi.string().optional().allow('', null),
    socialAccounts: Joi.array().items(Joi.string()).optional(),
    threadId: Joi.string().optional().allow(null),
  }),
};

const updateUserPreferences = {
  body: Joi.object().keys({
    notificationEnabled: Joi.boolean(),
    locationShared: Joi.boolean(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  updateUser,
  deleteUser,
  updateUserPreferences,
};
