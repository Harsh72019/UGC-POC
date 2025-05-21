const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPost = {
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
    platform: Joi.string()
      .valid('instagram', 'facebook', 'twitter', 'linkedin')
      .required(),
    postId: Joi.string().required(),
    content: Joi.string().required(),

    image: Joi.object({
      key: Joi.string().required(),
      url: Joi.string().uri().required(),
    }).optional().allow(null),

    hashtags: Joi.array().items(Joi.string()).optional(),
    mentions: Joi.array().items(Joi.string()).optional(),

    interactions: Joi.object({
      likes: Joi.number().integer().min(0),
      comments: Joi.number().integer().min(0),
      shares: Joi.number().integer().min(0),
    }).optional(),

    timestamp: Joi.date().iso().optional(),

    aiComments: Joi.array().items(
      Joi.object({
        text: Joi.string().required(),
        status: Joi.string().valid('suggested', 'commented', 'skipped', 'edited'),
        editedText: Joi.string().optional().allow(null),
      })
    ).optional(),
  }),
};

module.exports = {
  createPost,
};
