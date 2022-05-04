const crypto = require("crypto");

const getHashedPassword = (hashedPassword) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(hashedPassword).digest("base64");
  return hash;
};

function validateUsername(username) {
  let valid = true;
  valid = valid && username.length > 3;
  return valid;
}

function getUniqueFilename(filename) {
  // simon la till
  const timestamp = Date.now();

  const extension = filename.split(".").pop();

  return `${timestamp}.${extension}`;
}

const bcrypt = require("bcrypt");

const hashedPassword = (password) => {
  const hashValue = bcrypt.hashSync(password, 12);

  return hashValue;
};

const comparePassword = (password, hash) => {
  const correct = bcrypt.compareSync(password, hash);
  return correct;
};

function validateEmailAddress(input) {
  // https://stackoverflow.com/a/59264110
  var regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  if (regex.test(input)) {
    return 1;
  } else {
    return -1;
  }
}

module.exports = {
  hashedPassword,
  comparePassword,
  validateUsername,
  getUniqueFilename, //simon la till
  validateEmailAddress,
  getHashedPassword,
};
