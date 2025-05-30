const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mime = require("mime-types"); // npm install mime-types
const ApiError  = require("../utils/ApiError");
const config = require("../config/config");
const genAI = new GoogleGenerativeAI(config.google.apiKey);

/**
 * Fetch image as base64 and return with its MIME type
 * @param {string} url - Image CDN URL
 * @returns {Promise<{ base64: string, mimeType: string }>}
 */
async function fetchImageAsBase64AndMime(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const contentType = response.headers["content-type"];

  // Fallback: Guess MIME type from URL if header missing
  const mimeType =
    contentType || mime.lookup(url) || "image/jpeg";

  const base64 = Buffer.from(response.data).toString("base64");
  return { base64, mimeType };
}

/**
 * Generate a social-style AI comment from base64 image and caption
 * @param {string} base64Image - Base64-encoded image
 * @param {string} mimeType - MIME type of the image (e.g. image/png)
 * @param {string} caption - Caption describing the image
 * @returns {Promise<string>} AI-generated comment
 */
async function generateAIComment(base64Image, mimeType, caption) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Image,
    },
  };

  const prompt = `
You are SocialMediaCommentBot – a friendly, enthusiastic commenter who writes in a casual social-media style.
Your comments should:
- Be 1–2 short sentences
- Mention something specific you “see” or “feel” from the image or caption
- Use 1–3 emojis to add warmth
- Sound like a real person leaving a quick, positive note under a post

Use up to 15 words and feel free to add emojis like someone commenting on a post.
Caption for this image: ${caption}
`;

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  return response.text().trim();
}

/**
 * Generate AI comment from an image URL and caption
 * @param {string} imageUrl - URL of the image (CDN or remote)
 * @param {string} caption - Text caption from the post
 * @returns {Promise<string>} AI-generated comment
 */
async function generateCommentFromImage(imageUrl, caption) {
  try {
    const { base64, mimeType } = await fetchImageAsBase64AndMime(imageUrl);
    return await generateAIComment(base64, mimeType, caption);
    
  } catch (error) {
      throw new ApiError(404, error.message);
  }
}

module.exports = {
  generateCommentFromImage,
};
