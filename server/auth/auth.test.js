const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');
const config = require('../../config/config');

chai.config.includeStack = true;

describe('## Auth APIs', () => {
  let user = {
    username: 'testuser',
    email: 'testmail@gmail.com',
    password: 'validpass'
  };

  const validUserCredentials = {
    email: 'testmail@gmail.com',
    password: 'validpass'
  };

  const invalidUserCredentials = {
    email: 'invalidmail@gmail.com',
    password: 'invalidpass'
  };


  describe('# POST /api/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .send(user)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.user.username).to.equal(user.username);
          expect(res.body.user.email).to.equal(user.email);
          expect(res.body.user.password).to.not.equal(user.email);
          user = res.body.user;
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/auth/login', () => {
    it('should return Authentication error', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(invalidUserCredentials)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Authentication error, wrong credentials');
          done();
        })
        .catch(done);
    });

    it('should signin successfully and get valid JWT token', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('token');
          jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
            expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
            expect(decoded.email).to.equal(validUserCredentials.email);
            done();
          });
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/users/userId', () => {
    it('should delete user after test', (done) => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.message).to.equal('User deleted successfully');
          expect(res.body.user.username).to.equal(user.username);
          expect(res.body.user.email).to.equal(user.email);
          done();
        })
        .catch(done);
    });
  });
});
