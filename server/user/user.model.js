/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
const Promise = require('bluebird');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');


const SALT_WORK_FACTOR = 10;

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

    // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

      // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) return next(error);

        // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
  });
});

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
