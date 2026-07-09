const express = require('express');
const productController = require('../controller/productController');
const AuthCheck = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../utils/fileupload')

router.post('/create-product',AuthCheck,upload.array('images', 5),productController.createProduct);
router.get('/All-product',productController.getProduct);
router.put('/update-product/:id',AuthCheck,upload.array('images', 5),productController.updateProduct);
router.delete('/delete-product/:id',AuthCheck,upload.array('images', 5),productController.deleteProduct);  

module.exports = router;