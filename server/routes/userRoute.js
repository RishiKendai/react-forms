const router = require('express').Router();

const { login,register } = require('../controller/userController');
const userRegister = require('../middleware/validation/userRegister');
const userLogin = require('../middleware/validation/userLogin');

router.post('/auth/login', userLogin, login);
router.post('/auth/register', userRegister, register);

module.exports = router;
