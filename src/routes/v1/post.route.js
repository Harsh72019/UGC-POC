const express = require('express');

// const validate = require('../../middlewares/validate');
const {firebaseAuth} = require('../../middlewares/firebaseAuth');
// const postValidation = require('../../validations/post.validation');

const {postController} = require('../../controllers');

const router = express.Router();

router.post('/', postController.createPost);

router.get('/', firebaseAuth('All'), postController.getPost);

router.get("/seen/:postId", firebaseAuth('All'), postController.markAsSeen);

router.get('/current-page', firebaseAuth('All'), postController.getCurrentUserPage);

router.get('/generate-comment/:postId', firebaseAuth('All'), postController.generateComment);

router.delete('/:postId', firebaseAuth('Admin'), postController.deletePost);

router.get('/:postId', firebaseAuth('All'), postController.getPostWithId);

module.exports = router;
