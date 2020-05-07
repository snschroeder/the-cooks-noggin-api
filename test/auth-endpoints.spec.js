/* eslint-disable no-undef */
const app = require('../src/app');
const helpers = require('./test-helpers');
const AuthService = require('../src/auth/auth-service');

// =================== //
// Initial setup       //
// =================== //

describe('Auth endpoints', () => {
  const db = helpers.setupTestDB(app);
  const testUsers = helpers.makeTestUsersArray();
  const testUser = testUsers[0];
  const endpointPath = '/api/auth/login';

  // =================== //
  // Cleanup protocol    //
  // =================== //

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.truncateTables(db));
  afterEach('cleanup', () => helpers.truncateTables(db));

  // =================== //
  // POST tests          //
  // =================== //

  describe(`POST ${endpointPath}`, () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

    const requiredFields = ['username', 'password'];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
      };

      it(`responds 400 required error when ${field} is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post(`${endpointPath}`)
          .send(loginAttemptBody)
          .expect(400, {
            error: 'username and password are required',
          });
      });
    });

    it('responds 400 invalid username or password when given bad username', () => {
      const invalidUser = { username: 'bogus-user', password: 'hunter42' };
      return supertest(app)
        .post(`${endpointPath}`)
        .send(invalidUser)
        .expect(400, { error: 'invalid username or password' });
    });
    it('responds 200 and sends JWT auth token when valid login presented', () => {
      const testLogin = { username: testUser.username, password: testUser.password };
      const subject = testUser.username;
      const payload = { id: testUser.id, username: testUser.username };
      return supertest(app)
        .post(`${endpointPath}`)
        .send(testLogin)
        .expect(200, {
          authToken: AuthService.createJWT(subject, payload),
        });
    });
  });
});
