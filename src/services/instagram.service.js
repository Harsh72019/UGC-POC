const axios = require('axios');
const qs = require('qs');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const CLIENT_ID = '';
const CLIENT_SECRET = '';
const REDIRECT_URI = '';
let INSTAGRAM_ACCESS_TOKEN = '';

const auth = () => {
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=instagram_basic&response_type=code`;
  return authUrl;
};

const callbackHandler = async code => {
  if (!code) throw new ApiError(httpStatus.BAD_REQUEST, 'No code received from facebook');

  const shortTokenRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
    },
  });
  const shortLivedToken = shortTokenRes.data.access_token;

  const longTokenRes = await axios.get('https://graph.instagram.com/access_token', {
    params: {
      grant_type: 'ig_exchange_token',
      client_secret: CLIENT_SECRET,
      access_token: shortLivedToken,
    },
  });
  INSTAGRAM_ACCESS_TOKEN = longTokenRes.data.access_token;

  return INSTAGRAM_ACCESS_TOKEN;
};

const getMedia = async () => {
  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
  const response = await axios.get(url);
  return response.data;
};

const getBase64 = async mediaId => {
  const detailsUrl = `https://graph.instagram.com/${mediaId}?fields=id,media_type,media_url,thumbnail_url,permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
  const details = (await axios.get(detailsUrl)).data;

  let imageUrl = null;
  if (details.media_type === 'IMAGE' || details.media_type === 'CAROUSEL_ALBUM') {
    imageUrl = details.media_url;
  } else if (details.media_type === 'VIDEO') {
    imageUrl = details.thumbnail_url;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unsupported media type');
  }

  const imageRes = await axios.get(imageUrl, {responseType: 'arraybuffer'});
  const base64 = Buffer.from(imageRes.data, 'binary').toString('base64');

  return base64;
};

module.exports = { auth, callbackHandler, getMedia, getBase64 };
