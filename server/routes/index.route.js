const express = require('express');
const url = require('url');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const config = require('../../config/config');
const pjson = require('../../package.json');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
  const hostname = req.headers.host;
  const { pathname } = url.parse(req.url);
  res.json({
    success: true,
    env: config.env,
    hostname,
    pathname,
    version: pjson.version,
    message: 'API running like a Beast !',
  });
}
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

module.exports = router;
