const jwt = require('jsonwebtoken');
const config = require('./lib/config');

// const payload = {
//   clientId: 'test',
// };
// const secret = config.webServerSecret;

const payload = {
  id: '5585e362-93c2-4cd1-b898-8534deb3557f',
  email: 'umang5@gmail.com',
  name: 'Umang Tiwary',
  avatarUrl: 'www.google.com',
};
const secret = config.userApiSecret;

const token = jwt.sign(payload, secret);

console.log(token);
