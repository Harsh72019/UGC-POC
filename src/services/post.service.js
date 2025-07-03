const {Post} = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const {generateCommentFromImage} = require('./commentGeneration.service');
const {PlatformCommentUsage} = require('../models/platformCommentUsage.model');
const {fetchImageAsBase64AndMime} = require('../services/commentGeneration.service');

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
    .map((post, index) => {
      if (!post || typeof post !== 'object') return null;

      const {
        platform,
        postId,
        content,
        image = [],
        hashtags = [],
        mentions = [],
        interactions = {},
        timestamp = new Date(),
        metadata = {},
      } = post;

      if (!platform || !postId || !content) return null;

      return {
        updateOne: {
          filter: {userId, platform, postId},
          update: {
            $set: {
              content,
              image,
              hashtags,
              mentions,
              metadata,
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
    const result = await Post.bulkWrite(operations, {ordered: false});
    console.log(`[Post Sync] Inserted: ${result.upsertedCount}, Updated: ${result.modifiedCount}`);
    // Just for the POC purpose lets keep it this way we can later add a Queue to process this task
    setImmediate(async () => {
      for (const op of operations) {
        const {filter, update} = op.updateOne;
        const imageUrls = update.$set.image;
        const metadata = update.$set.metadata;

        try {
          const base64Images =
            Array.isArray(imageUrls) && imageUrls.length > 0
              ? await Promise.all(
                  imageUrls.map(async url => {
                    const {base64, mimeType} = await fetchImageAsBase64AndMime(url);
                    return `data:${mimeType};base64,${base64}`;
                  })
                )
              : [];

          let updatedProfileImage = null;
          const profileImageUrl = metadata?.user?.profileImage;

          if (profileImageUrl) {
            try {
              const {base64, mimeType} = await fetchImageAsBase64AndMime(profileImageUrl);
              updatedProfileImage = `data:${mimeType};base64,${base64}`;
            } catch (err) {
              console.warn(`[Image Processor] Skipping profile image for post ${filter.postId}: ${err.message}`);
            }
          }

          const updateFields = {
            ...(base64Images.length > 0 && {image: base64Images}),
            ...(updatedProfileImage && {'metadata.user.profileImage': updatedProfileImage}),
          };

          if (Object.keys(updateFields).length > 0) {
            await Post.updateOne(filter, {$set: updateFields});
            console.log(`[Image Processor] Post ${filter.postId} updated with images.`);
          }
        } catch (err) {
          console.error(`[Image Processor] Failed to process post ${filter.postId}:`, err.message);
        }
      }
    });

    return result;
  } catch (err) {
    console.error('[Post Sync] Bulk write error:', err);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to save posts');
  }
}

const COMMENT_LIMIT = 10;
const WINDOW_DURATION_MINUTES = 240;
const NEAR_LIMIT_THRESHOLD = 0.8;

async function generateComment(postId, userId) {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found.');
  }

  const platform = post.platform;

  const windowStart = new Date(
    Math.floor(Date.now() / (WINDOW_DURATION_MINUTES * 60 * 1000)) * (WINDOW_DURATION_MINUTES * 60 * 1000)
  );

  const usage = await PlatformCommentUsage.findOneAndUpdate(
    {userId, platform, windowStart},
    {$inc: {count: 1}},
    {new: true, upsert: true}
  );

  const limitExceeded = usage.count > COMMENT_LIMIT;
  const nearLimit = usage.count >= COMMENT_LIMIT * NEAR_LIMIT_THRESHOLD && !limitExceeded;
  const limitReached = limitExceeded;

  if (!post.image?.[0]) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found.');
  }

  const commentText = await generateCommentFromImage(post.image[0], post.content);

  const newComment = {text: commentText};
  post.aiComments.push(newComment);
  post.commentGenerated = true;
  await post.save();

  return {
    comment: commentText,
    limitReached,
    nearLimit,
    limitExceeded,
  };
}

// console.log(await generateComment('68384d77234e54549f2db064'))
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
  generateComment,
};
