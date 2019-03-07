const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const authCtrl = require('../controllers/auth.controller');
const config = require('../../config/config');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** GET /api/auth/test - Testing route, Protected with token and Role validation,
 * needs token returned by the above as header. Authorization: Bearer {token}
 * needs token data to contain role: USER
 * return success message if correct token provided
 * */
router.route('/test')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getTestMessage);

module.exports = router;
