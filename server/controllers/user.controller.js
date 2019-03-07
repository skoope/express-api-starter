const httpStatus = require('http-status');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const User = require('../models/user.model');
const APIError = require('../helpers/APIError');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
function create(req, res, next) {
  User.findOne({ email: req.body.email }, (userSearchError, returnedUser) => {
    if (userSearchError) return next(userSearchError);

    if (returnedUser) {
      const apiError = new APIError('User already exists', httpStatus.CONFLICT, true);
      return next(apiError);
    }

    // instanciate new mongoose User
    const user = new User(req.body);

    // create jwt token based on user email and id with an expiration time of 60days
    const token = jwt.sign({
      _id: user._id,
      role: user.role
    }, config.jwtSecret, {
      expiresIn: '60 days'
    });

    return user.save()
      .then(savedUser => res.status(201).json({
        message: 'User created successfully',
        user: savedUser,
        token
      }))
      .catch(e => next(e));
  });
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
function update(req, res, next) {
  const existingUser = req.user;
  const updatedUser = _.merge(existingUser, req.body);

  updatedUser.save()
    .then(savedUser => res.json({
      message: 'User updated successfully',
      user: savedUser
    }))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(returnedUser => res.json({
      users: returnedUser
    }))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json({
      message: 'User deleted successfully',
      user: deletedUser
    }))
    .catch(e => next(e));
}

/**
 * Delete all users.
 * @returns {User}
 */
function removeMany(req, res, next) {
  User.deleteMany({})
    .then(deletedUsers => res.json({
      message: `${deletedUsers.deletedCount} user(s) deleted`
    }))
    .catch(e => next(e));
}


module.exports = { load, get, create, update, list, remove, removeMany };
