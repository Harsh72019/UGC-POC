const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {postService} = require('../services');

const generateComment = catchAsync(async (req , res) => {
  const postId = req.params.postId
  const comment = await postService.generateComment(postId);
  res.status(200).send({status : true , data: comment, message: 'Comment created successfully'});
})

const createPost = catchAsync(async (req, res) => {
  const user = req.user;
  let posts = Array.isArray(req.body.posts) ? req.body.posts : [req.body.posts]; 
  const post = await postService.savePostsToBackend(posts,  user._id);
  res.status(200).send({status : true , data: post, message: 'Posts created successfully'});
});

const getPost = catchAsync(async (req , res ) => {
    const user = req.user;
    const updatedFilter = {
        ...req.query, 
        userId: user._id,
    };

    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc',
        populate: 'userId::name,phone,socialAccounts,interests,goals,gender,email,profilePic,dob',
    };

    const post = await postService.getPosts(updatedFilter, options);
    res.status(200).send({ status: true, data: post, message: 'Posts fetched successfully' });
});


const getPostWithId = catchAsync(async (req , res ) => {
    const postId = req.params.postId;
    const post = await postService.getPostById(postId);
    res.status(200).send({status : true ,  data: post, message: 'Post fetched successfully'});
})

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.postId);
  res.status(200).send({status : true ,  message: 'The post deletion process has been completed successfully.'});
});

// // 🔢 Mock media arrays
// const avatarUrls = [
//   "https://images.pexels.com/photos/31202661/pexels-photo-31202661.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/6930386/pexels-photo-6930386.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/17492966/pexels-photo-17492966.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/28846615/pexels-photo-28846615/free-photo-of-charming-street-in-lisbon-with-cyclists.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/32115460/pexels-photo-32115460/free-photo-of-elegant-woman-enjoying-sunset-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/32305077/pexels-photo-32305077/free-photo-of-serene-coastal-sunset-with-crescent-moon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"

// ];

// const imageUrls = [
//   "https://images.pexels.com/photos/2033997/pexels-photo-2033997.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/929778/pexels-photo-929778.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/32305069/pexels-photo-32305069/free-photo-of-vibrant-red-bougainvillea-in-mediterranean-street-scene.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/32305068/pexels-photo-32305068/free-photo-of-neon-lit-cocktail-bar-at-dusk-with-vibrant-signage.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/32303967/pexels-photo-32303967/free-photo-of-peaceful-beach-scene-with-two-empty-chairs.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//   "https://images.pexels.com/photos/32303971/pexels-photo-32303971/free-photo-of-tropical-beach-scene-with-palm-trees-in-summer.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//     "https://images.pexels.com/photos/32303951/pexels-photo-32303951/free-photo-of-serene-pink-salt-lake-landscape-at-sunrise.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"

// ];

// // 📌 Helper to generate a random alphanumeric key
// const generateKey = (prefix = "img") => `${prefix}_${Math.random().toString(36).substring(2, 10)}`;

// // 🔁 Helper to get N unique random items
// const getRandomItems = (arr, count) => {
//   const shuffled = [...arr].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };
// const {Post} = require('../models/post.model')
// // 📦 Main function to enrich posts
// async function enrichPostsWithMedia() {
//   try {
//     const posts = await Post.find();

//     for (const post of posts) {
//       // 👉 Random avatar
//       const avatarUrl = avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
//       const avatarKey = generateKey("avatar");

//       // 👉 2–3 random images
//       const imageCount = Math.floor(Math.random() * 2) + 2; // 2 or 3
//       const selectedImages = getRandomItems(imageUrls, imageCount).map((url) => ({
//         key: generateKey("img"),
//         url,
//       }));

//       // 🔄 Update post
//       post.avatar = { key: avatarKey, url: avatarUrl };
//       post.image = selectedImages;

//       await post.save(); // 🧩 Save updated post
//     }

//     console.log("✅ All posts enriched with avatar and images.");
//   } catch (err) {
//     console.error("❌ Error enriching posts:", err);
//   }
// }
// enrichPostsWithMedia()

module.exports = {
  deletePost,
  getPost,
  getPostWithId,
  createPost,
  generateComment
};
