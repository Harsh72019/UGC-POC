const admin = require('firebase-admin');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const serviceAccount = require('../../firebase-service-secret.json');
const {authService} = require('../services');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseAuth = (allowUserType = 'All') => async (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    const token = req.headers?.authorization?.split(' ')[1];
    // token not found
    if (!token) {
      reject(new ApiError(httpStatus.BAD_REQUEST, 'Please Authenticate!'));
    }
    try {
      const payload = await admin.auth().verifyIdToken(token, true);
      const user = await authService.getUserByFirebaseUId(payload.uid);
      if (!user) {
        if (['/register'].includes(req.path) || req.path.includes('secretSignup')) {
          req.newUser = payload;
        } else reject(new ApiError(httpStatus.NOT_FOUND, "User doesn't exist. Please create account"));
      } else {
        if (!allowUserType.split(',').includes(user.__t) && allowUserType !== 'All') {
          reject(new ApiError(httpStatus.FORBIDDEN, "Sorry, but you can't access this"));
        }
        if (user.isBlocked) {
          reject(new ApiError(httpStatus.FORBIDDEN, 'User is blocked'));
        }
        if (user.isDeleted) {
          reject(new ApiError(httpStatus.GONE, "User doesn't exist anymore"));
        }
        req.user = user;
      }

      resolve();
    } catch (err) {

  console.error("🔥 Firebase token exchange error:");
  console.error("Response data:", err.response?.data);
  console.error("Request payload:", {
    token: customToken,
    returnSecureToken: true,
  });
  console.error("API key:", config.firebase.apiKey);
  // throw new ApiError(500, err.response?.data?.error?.message || 'Token exchange failed');

      if (err.code === 'auth/id-token-expired') {
        reject(new ApiError(httpStatus.UNAUTHORIZED, 'Session is expired'));
      }
      console.log('FirebaseAuthError:', err);
      reject(new ApiError(httpStatus.UNAUTHORIZED, 'Failed to authenticate'));
    }
  })
    .then(() => next())
    .catch(err => next(err));
};

module.exports = {firebaseAuth, admin};
