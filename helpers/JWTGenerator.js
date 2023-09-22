const jwt = require('jsonwebtoken');

const JWTGenerator = async (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: '4h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('Unable to generate token');
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = { JWTGenerator };
