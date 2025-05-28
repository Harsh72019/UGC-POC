const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {postService} = require('../services');

const createPost = catchAsync(async (req, res) => {
  const user = req.user;
  let posts = Array.isArray(req.body.posts) ? req.body.posts : [req.body.posts]; 
  const post = await postService.savePostsToBackend(posts,  user._id);
  res.status(200).send({status : true , data: post, message: 'Posts created successfully'});
});

const getPost = catchAsync(async (req , res ) => {
    let user = req.user;
    const updatedFilter = {
        ...req.query , 
        userId: user._id,
    }
    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc',
    }
    const post = await postService.getPosts(updatedFilter , options);
    res.status(200).send({status : true ,  data: post, message: 'Post successfully added'});
})

const getPostWithId = catchAsync(async (req , res ) => {
    const postId = req.params.postId;
    const post = await postService.getPostById(postId);
    res.status(200).send({status : true ,  data: post, message: 'Post fetched successfully'});
})

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.postId);
  res.status(200).send({status : true ,  message: 'The post deletion process has been completed successfully.'});
});

module.exports = {
  deletePost,
  getPost,
  getPostWithId,
  createPost,
};
