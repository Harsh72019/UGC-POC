const config = require('../config/config');
const { authService, userService } = require('../services');
const {admin} = require('../middlewares/firebaseAuth');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');

/**
 * Prepare user object from Firebase decoded token
 */
const createNewUserObject = (firebaseUser) => ({
  email: firebaseUser.email,
  firebaseUid: firebaseUser.uid,
  profilePic: firebaseUser.picture || null,
  firebaseSignInProvider: firebaseUser.firebase?.sign_in_provider || 'password',
});

/**
 * 🔐 Login controller (Firebase already validated the user and attached to req.user)
 */
const loginUser = catchAsync(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    status: true,
    message: 'Login successful',
    data: user,
  });
});

/**
 * 📝 Register controller — only called if user doesn't exist in DB but exists in Firebase
 */
const registerUser = catchAsync(async (req, res) => {
  if (req.user) {
    return res.status(409).json({
      status: false,
      message: 'User already exists',
    });
  }

  const userData = {
    ...createNewUserObject(req.newUser), // from Firebase token
    ...req.body, // optional fields like name, gender, dob, etc.
  };

  const newUser = await authService.createUser(userData); // optional profilePic file

  res.status(201).json({
    status: true,
    message: 'User registered successfully',
    data: newUser,
  });
});



const generateToken = catchAsync(async (req, res) => {
  if (config.env == 'production')
    throw new ApiError(httpStatus.NOT_FOUND, 'Could not find the route you are looking for');
  console.log('Generating token for user:', req.params.uid);
  const token = await admin.auth().createCustomToken(req.params.uid);
  console.log('Token:', token);
  console.log(config.firebase.apiKey , 'apiKey'); 
  const {
    data: {idToken},
  } = await axios({
    url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${config.firebase.apiKey}`,
    method: 'post',
    data: {
      token,
      returnSecureToken: true,
    },
    json: true,
  });

  res.json({
    data: {
      status: true,
      token: idToken,
    },
  });
});


module.exports = {
  loginUser,
  registerUser,
  generateToken
};
