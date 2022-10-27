const router = require('express').Router();
const { register, login } = require('../controller/adminController');
// Validation Middleware
const adminRegister = require('../middleware/validation/adminRegister');
const adminLogin = require('../middleware/validation/adminLogin');

router.post('/auth/register', adminRegister, register);
router.post('/auth/login', adminLogin, login);

module.exports = router;
