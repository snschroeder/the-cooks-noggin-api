const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('knex');

function setupTestDB(app) {
  const db = knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  });
  app.set('db', db);
  return db;
}

function makeTestUsersArray() {
  return [
    {
      id: '53d25d5f-a033-40b3-a253-84172a514973',
      username: 'test-user-1',
      password: 'testPassword1',
    },
    {
      id: 'cc5fe585-8682-4499-a04e-6255b42116c1',
      username: 'test-user-2',
      password: 'Testpass12345',
    },
  ];
}

function seedUsers(db, users) {
  const userswithEncryptedPasswords = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db.insert(userswithEncryptedPasswords).into('users');
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ id: user.id, username: user.username }, secret, {
    subject: user.username,
    expiresIn: '1h',
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

function truncateTables(db) {
  return db.transaction((trx) => trx.raw(
    `TRUNCATE
        users
        RESTART IDENTITY CASCADE;`,
  ));
}

module.exports = {
  setupTestDB,
  makeTestUsersArray,
  seedUsers,
  makeAuthHeader,
  truncateTables,
};
