const Product = require("../models/Product");
const httpStatusCode = require("../utils/httpStatusCode");
const logger = require("../utils/logger");
const cloudinary = require('cloudinary').v2;



class ProductController {

async createProduct(req, res) {
    try {
        
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        let requestData = {};

        if (req.body.data && typeof req.body.data === "string") {
            requestData = JSON.parse(req.body.data);
        } else {
            requestData = req.body;
        }

        const { name, description, price, images } = requestData;

        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "swagger_images",
                });
                imageUrls.push(result.secure_url);
            }
        } else if (images && Array.isArray(images)) {
            imageUrls = images;
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            images: imageUrls,
        });

        return res.status(httpStatusCode.CREATED).json({
            success: true,
            message: "Product has been created",
            data: newProduct,
        });

    } catch (err) {
        logger.error(`Product Creation Error: ${err.message}`);
        return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: err.message,
        });
    }
}
    async getProduct(req, res) {
        try {
            const products = await Product.find();
            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "All products fetched successfully",
                length: products.length,
                data: products
            })
        }
        catch (err) {
            return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: `${err?.message || "Internal Server Error"}`
            })
        }

    }

    //edit product

    async updateProduct(req, res) {
        try {
            const { id } = req.params;

            const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            })
            if (!updateProduct) {
                return res.status(httpStatusCode.NOT_FOUND).json({
                    success: false,
                    message: "Product not found"
                })
            }
            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "product updated successfully",
                data: updateProduct
            })
        }

        catch (err) {
            return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: `${err?.message || "Internal Server Error"}`
            })
        }
    }



    async deleteProduct(req, res) {
        try {
            const { id } = req?.params;
            const productDelete = await Product.findByIdAndDelete(id);
            if (!productDelete) {
                return res.status(httpStatusCode.NOT_FOUND).json({
                    success: false,
                    message: "Product not found"
                })
            }

            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Product deleted successfully"
            })
        }
        catch (err) {
            return res.status(httpStatusCode.NOT_FOUND).json({
                success: false,
                message: `${err?.message || "Internal Server Error"}`
            })
        }
    }
}

module.exports = new ProductController();