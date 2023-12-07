const jwt = require('jsonwebtoken');
const config = require('./lib/config');

// const payload = {
//   clientId: 'test',
// };
// const secret = config.webServerSecret;

const payload = {
  user: {
    id: '3809ff03-4f32-40c8-957b-250f7b607d94',
    email: 'agrawalravi95@gmail.com',
    name: 'Ravi Agrawal',
    avatarUrl: 'www.google.com',
  },
};
const secret = config.userApiSecret;

const token = jwt.sign(payload, secret);

console.log(token);
