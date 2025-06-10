const express = require('express');

// const validate = require('../../middlewares/validate');
const {firebaseAuth} = require('../../middlewares/firebaseAuth');
// const postValidation = require('../../validations/post.validation');

const {postController} = require('../../controllers');

const router = express.Router();

// for updating postDetails
router.post(
  '/',
  // firebaseAuth('All'),
  //   validate(postValidation.updateDetails),
  postController.createPost
);

// for updating specific post preferences
router.get(
  '/',
  //   validate(postValidation.updateUserPreferences),
  firebaseAuth('All'),
  postController.getPost
);

// for getting a post by id
router.get('/:postId', firebaseAuth('All'), postController.getPostWithId);

router.get('/generate-comment/:postId',firebaseAuth('All'), postController.generateComment);
// for deleting a post
router.delete(
  '/:postId',
  // validate(postValidation.deleteUser),
  firebaseAuth('Admin'),
  postController.deletePost
);

module.exports = router;
