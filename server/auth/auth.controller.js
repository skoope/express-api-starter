const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const User = require('../user/user.model');

/**
 * Returns jwt token if valid email and password are provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // eslint-disable-next-line consistent-return
  User.findOne({ email: req.body.email }, (userSearchError, returnedUser) => {
  // in case of mongosearch error
    if (userSearchError) return next(userSearchError);

  // in case user not found in db
    if (!returnedUser) {
      const apiError = new APIError('Authentication error, wrong credentials', httpStatus.UNAUTHORIZED, true);
      return next(apiError);
    }

  // in case user found, decrypt and compare password
    returnedUser.comparePassword(req.body.password, (compareError, isMatch) => {
      // in case of bcrypt error
      if (compareError) return next(compareError);

      // user found & password matches
      if (isMatch) {
        const token = jwt.sign({
          _id: returnedUser._id,
          role: returnedUser.role,
        }, config.jwtSecret, {
          expiresIn: '60 days'
        });
        return res.json({
          user: returnedUser,
          token
        });
      }

      // in case of wrong password
      const apiError = new APIError('Authentication error, wrong credentials', httpStatus.UNAUTHORIZED, true);
      return next(apiError);
    });
  });
}

/**
 * This is a protected route. Will return success message
 * only if jwt token is provided in header with role: USER
 * @param req
 * @param res
 * @returns {*}
 */
function getTestMessage(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    message: 'Success'
  });
}

module.exports = { login, getTestMessage };
