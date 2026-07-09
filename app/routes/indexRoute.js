const express = require('express');
const authRoute = require('../routes/authRoute')
const productRoute = require('../routes/productRoute')
const router = express.Router();



router.use('/auth',authRoute);
router.use('/product',productRoute);



module.exports = router;




