const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getUser: (db, username) => db('users')
    .select('*')
    .where({ username })
    .first(),

  // eslint-disable-next-line max-len
  validatePassword: (db, username, password) => AuthService.getUser(db, username).then((user) => bcrypt.compare(password, user.password)),

  createJWT: (subject, payload) => jwt.sign(payload, config.JWT_SECRET, {
    subject,
    expiresIn: '1h',
    algorithm: 'HS256',
  }),

  verifyJWT: (token) => jwt.verify(token, config.JWT_SECRET, {
    algorith: 'HS256',
  }),
};

module.exports = AuthService;
