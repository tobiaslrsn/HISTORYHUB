const jwt = require("jsonwebtoken");

const forceAuthorize = (req, res, next) => {
  // INLOGGADE
  const { token } = req.cookies;
  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    next();
  } else {
    // UTLOGGADE
    res.sendStatus(401); // eller redirecta till någon sida.
  }
};

module.exports = { forceAuthorize };
