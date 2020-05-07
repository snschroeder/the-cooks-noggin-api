/* eslint-disable no-undef */
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

// =================== //
// Initial setup       //
// =================== //

describe('Users endpoints', () => {
  const db = helpers.setupTestDB(app);
  const testUsersArray = helpers.makeTestUsersArray();
  const testUser = testUsersArray[0];
  const endpointPath = '/api/users/';


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
    beforeEach('insert users', () => helpers.seedUsers(db, testUsersArray));

    const requiredFields = ['username', 'password'];
    requiredFields.forEach((field) => {
      const regAttemptBody = {
        username: 'testUser',
        password: 'password',
      };

      it(`responds 400 username and password are required when ${field} is missing`, () => {
        delete regAttemptBody[field];
        return supertest(app)
          .post(endpointPath)
          .send(regAttemptBody)
          .expect(400, { error: 'username and password are required' });
      });
    });


    context('Password validation', () => {
      it('responds 400 password must be longer than 8 char when password is too short', () => {
        const testRegistration = {
          username: 'testUserBob',
          password: '123abc',
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect(400, { error: 'password must be longer than 8 characters' });
      });
      it('responds 400 password must be fewer than 50 char when password is too long', () => {
        const testRegistration = {
          username: 'testUserLevi',
          password: 'arf'.repeat(90),
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect(400, { error: 'password must be fewer than 50 characters' });
      });
      it('responds 400 password must not begin or end with whitespace when password begins with whitespace', () => {
        const testRegistration = {
          username: 'testUserTrouble',
          password: '   Iamafailingpassword2',
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect(400, { error: 'password must not begin or end with whitespace' });
      });
      it('responds 400 password must not begin or end with whitespace when password ends with whitespace', () => {
        const testRegistration = {
          username: 'testUserMax',
          password: 'Iamalsoafailingpassword44    ',
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect(400, { error: 'password must not begin or end with whitespace' });
      });
      it('respnds 400 password must contain at least one uppercase, lowercase, and number characters when password is too simple', () => {
        const testRegistration = {
          username: 'testUserMackenzie',
          password: 'abc12345',
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect(400, { error: 'password must contain at least one uppercase, lowercase, and number characters' });
      });
    });
    context('Username validation', () => {
      it('responds 400 invalid username when username is already taken', () => {
        const testRegistration = {
          username: testUser.username,
          password: 'NewPasswordletsGoo11!!',
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect(400, { error: 'username is invalid' });
      });
      it('responds 400 invalid username when username is too short', () => {
        const testRegistration = {
          username: 'ab',
          password: 'NewPasswordletsGoo11!!',
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect(400, { error: 'username is invalid' });
      });
      it('responds 400 invalid username when username is too long', () => {
        const testRegistration = {
          username: 'ab'.repeat(50),
          password: 'NewPasswordletsGoo11!!',
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect(400, { error: 'username is invalid' });
      });
      it('responds 400 invalid username when username begins with whitespace', () => {
        const testRegistration = {
          username: '  bob',
          password: 'NewPasswordletsGoo11!!',
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect(400, { error: 'username is invalid' });
      });
      it('responds 400 invalid username when username ends with whitespace', () => {
        const testRegistration = {
          username: 'differentbob    ',
          password: 'NewPasswordletsGoo11!!',
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect(400, { error: 'username is invalid' });
      });
    });
    context('Given Valid Registration', () => {
      it('responds 201 with { id, username }', () => {
        const testRegistration = {
          username: 'theOneTrueBob',
          password: 'NewPasswordletsGoo11!!',
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect(201)
          .expect((res) => {
            chai.expect(res.body).to.have.property('id');
            chai.expect(res.body).to.have.property('username');
            chai.expect(res.body).to.not.have.property('password');
            chai.expect(res.body.id).to.have.lengthOf(36);
            chai.expect(res.body.username).to.eql(testRegistration.username);
          });
      });
      it('stores the new user in the db with a hashed password', () => {
        const testRegistration = {
          username: 'BobsBrotherRobert',
          password: 'NewPasswordletsGoo11!!',
        };
        return supertest(app)
          .post(endpointPath)
          .send(testRegistration)
          .expect((res) => {
            const { id } = res.body;
            db('users')
              .select('*')
              .where({ id })
              .first()
              .then(async (row) => {
                const { username, password } = row;
                chai.expect(username).to.eql(testRegistration.username);
                const passesMatch = await bcrypt.compare(
                  testRegistration.password,
                  password,
                );
                // eslint-disable-next-line no-unused-expressions
                chai.expect(passesMatch).to.be.true;
              });
          });
      });
    });
  });

  // =================== //
  // GET tests           //
  // =================== //

  describe(`GET ${endpointPath}/:user_id`, () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsersArray));

    it('responds 400 user does not exist when user does not exist in the db', () => supertest(app)
      .get(`${endpointPath}/00000000-0000-0000-0000-000000000000`)
      .expect(400, { error: 'user does not exist' }));
    it('responds 200 with user data when user is present', () => supertest(app)
      .get(`${endpointPath}/cc5fe585-8682-4499-a04e-6255b42116c1`)
      .expect(200)
      .then((res) => {
        const expectedUserData = { ...testUsersArray[1] };
        delete expectedUserData.password;
        delete expectedUserData.username;
        chai.expect(res.body).to.eql(expectedUserData);
      }));
  });
});
