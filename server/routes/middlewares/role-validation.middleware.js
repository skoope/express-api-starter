const _ = require('lodash');
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');

/**
 * Function validateRoles accepts one role or an array of allowed roles
 * Return authorization error if user role is not one of the allowed roles
 */
module.exports = function validateRoles(roles) {
  const allowMultipleRoles = _.isArray(roles);
  return (req, res, next) => {
    if (allowMultipleRoles) {
      if (_.includes(roles, req.user.role)) {
        return next();
      }
    }
    if (roles === req.user.role) {
      return next();
    }
    const err = new APIError('Acces denied permissions required', httpStatus.UNAUTHORIZED, true);
    return next(err);
  };
};
