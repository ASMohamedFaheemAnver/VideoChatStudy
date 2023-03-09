const twilio = require("twilio");

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const apiKey = process.env.apiKey;
const apiSecret = process.env.apiSecret;

const generateToken = (identity, roomName) => {
  const videoGrant = new twilio.jwt.AccessToken.VideoGrant({
    room: roomName,
  });
  const token = new twilio.jwt.AccessToken(accountSid, apiKey, apiSecret, {
    identity: identity,
  });
  token.addGrant(videoGrant);
  return token.toJwt();
};

module.exports = { generateToken };
