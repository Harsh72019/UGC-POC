const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPost = {
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),

    avatar: Joi.object({
      key: Joi.string().required(),
      url: Joi.string().uri().required(),
    }).optional().allow(null),

    platform: Joi.string()
      .valid('instagram', 'facebook', 'twitter', 'linkedin')
      .required(),

    postId: Joi.string().required(),

    content: Joi.string().required(),

    image: Joi.array()
      .items(
        Joi.object({
          key: Joi.string().required(),
          url: Joi.string().uri().required(),
        }).optional().allow(null)
      )
      .optional(),

    hashtags: Joi.array().items(Joi.string()).optional(),

    mentions: Joi.array().items(Joi.string()).optional(),

    interactions: Joi.object({
      likes: Joi.number().integer().min(0).optional(),
      comments: Joi.number().integer().min(0).optional(),
      shares: Joi.number().integer().min(0).optional(),
    }).optional(),

    timestamp: Joi.date().iso().optional(),

    aiComments: Joi.array()
      .items(
        Joi.object({
          text: Joi.string().required(),
          status: Joi.string().valid('suggested', 'commented', 'skipped', 'edited'),
          editedText: Joi.string().optional().allow(null),
        })
      )
      .optional(),

    commentGenerated: Joi.boolean().optional(),
  }),
};

module.exports = {
  createPost,
};
