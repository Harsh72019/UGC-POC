const express = require('express');

const validate = require('../../middlewares/validate');
const {firebaseAuth} = require('../../middlewares/firebaseAuth');
const userValidation = require('../../validations/user.validation');

const {userController} = require('../../controllers');
const {fileUploadService} = require('../../microservices');

const router = express.Router();

// for updating userDetails
router.patch(
  '/updateDetails',
  fileUploadService.multerUpload.single('profilePic'),
  firebaseAuth('All'),
  // validate(userValidation.updateDetails),
  userController.updateUser
);

// Later we can add a validation to get user only by their own id
router.get('/getUserDetails', firebaseAuth('All'), userController.getUser);
// for updating specific user preferences
router.patch(
  '/updatePreferences',
  validate(userValidation.updateUserPreferences),
  firebaseAuth('All'),
  userController.updatePreferences
);

// for deleting a user
router.delete('/:userId', validate(userValidation.deleteUser), firebaseAuth('Admin'), userController.deleteUser);

// to soft delete a user
router.post('/delete/:userId', validate(userValidation.deleteUser), firebaseAuth('All'), userController.softDeleteUser);

module.exports = router;
