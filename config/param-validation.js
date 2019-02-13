const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().min(2).max(15).required(),
      role: Joi.strict().valid('USER', 'ADMIN'),
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },

  // PUT /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().min(2).max(15),
      email: Joi.string().email()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
