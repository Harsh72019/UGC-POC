const { Post } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const postValidator = post => {
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found.');
  }
};

async function getPostById(id) {
  const post = await Post.findById(id);
  postValidator(post);
  return post;
}

async function getPosts(filters, options) {
  return await Post.paginate(filters, options);
}

/**
 * Save or update posts from Chrome extension to backend.
 * @param {Array} posts - Array of post objects from the extension.
 * @param {ObjectId} userId - Logged-in user's ID.
 */
async function savePostsToBackend(posts, userId) {
  if (!Array.isArray(posts) || !userId) return;

  const operations = posts
    .map((post) => {
      const {
        platform,
        postId,
        content,
        image = null,
        hashtags = [],
        mentions = [],
        interactions = {},
        timestamp = new Date(),
      } = post;

      if (!platform || !postId || !content) return null;

      return {
        updateOne: {
          filter: { userId, platform, postId },
          update: {
            $set: {
              content,
              image,
              hashtags,
              mentions,
              interactions: {
                likes: interactions.likes || 0,
                comments: interactions.comments || 0,
                shares: interactions.shares || 0,
              },
              timestamp: new Date(timestamp),
            },
          },
          upsert: true,
        },
      };
    })
    .filter(Boolean);

  if (operations.length === 0) return;

  try {
    const result = await Post.bulkWrite(operations, { ordered: false });
    console.log(`[Post Sync] Inserted: ${result.upsertedCount}, Updated: ${result.modifiedCount}`);
    return result;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR ,  `Failed to save posts`);
  }
}


async function deletePostById(id) {
  try {
    await Post.findByIdAndDelete(id);
    return true;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete the post');
  }
}


module.exports = {
  getPosts,
  getPostById,
  deletePostById,
 savePostsToBackend,
};
