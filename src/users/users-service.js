const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])+/;

const UsersService = {
  hashPass: (password) => bcrypt.hash(password, 12),

  validatePassword: (password) => {
    if (password.length < 8) {
      return 'password must be longer than 8 characters';
    }
    if (password.length > 50) {
      return 'password must be fewer than 50 characters';
    }
    if (password.trim() !== password) {
      return 'password must not begin or end with whitespace';
    }
    if (!REGEX_UPPER_LOWER_NUMBER.test(password)) {
      return 'password must contain at least one uppercase, lowercase, and number characters';
    }
    return null;
  },
  validateUsername: (username) => {
    if (username.length < 3 || username.length > 32 || username.trim() !== username) {
      return -1;
    }
    return null;
  },

  validateNewUser: (db, username) => db('users')
    .select('*')
    .where({ username })
    .first(),

  createNewUser: (db, username, password) => db('users')
    .insert({ username, password })
    .then(() => db('users')
      .select('id', 'username')
      .where({ username })
      .first()),

  updateUser: (db, username, updateFields) => db('users')
    .where({ username })
    .update(updateFields),

  getUser: (db, id) => db('users')
    .select('id')
    .where({ id })
    .first(),
};

module.exports = UsersService;
