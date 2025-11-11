const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { createLimiter } = require('../middlewares/rateLimiter');

// Strict limiter for login to mitigate brute force
const loginLimiter = createLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

router.post('/login', loginLimiter, ctrl.login);
// refresh/logout endpoints removed because refresh-token flow was disabled

module.exports = router;
