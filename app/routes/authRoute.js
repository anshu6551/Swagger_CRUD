const express = require('express');

const router = express.Router();
const upload = require('../utils/fileupload')
const authController = require('../controller/authController');


router.post('/register',upload.array('images', 5),authController.userRegister);
router.post('/login',authController.loginUser);


module.exports = router
