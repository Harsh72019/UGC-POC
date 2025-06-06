const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {userService} = require('../services');
 
const updateUser = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUserById(req.user._id, req.body, req.file);
  res.status(200).send({status : true,data: updatedUser, message: 'Your details are updated'});
});

const getUser = catchAsync(async (req, res) => {
  const user = req.user;
  const userId = user._id
  const userData = await userService.getUserById(userId);
  res.status(200).send({status : true , data: userData , message : "User details fetched successfully"});
});

const updatePreferences = catchAsync(async (req, res) => {
  const updatedUser = await userService.updatePreferencesById(req.user._id, req.body);
  res.status(200).send({status : true , data: updatedUser, message: 'Your preferences are updated'});
});

const softDeleteUser = catchAsync(async (req, res) => {
  const {userId} = req.params;
  if (req.user.__t !== 'Admin' && userId !== req.user._id.toString()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Sorry, you are not authorized to do this');
  }
  await userService.markUserAsDeletedById(req.params.userId);
  res.status(200).send({
    status : true,
    message: 'User has been removed successfully.',
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(200).send({status : true, message: 'The user deletion process has been completed successfully.'});
});

module.exports = {
  deleteUser,
  updateUser,
  softDeleteUser,
  updatePreferences,
  getUser,
};
