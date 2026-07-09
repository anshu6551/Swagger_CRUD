const user = require('../models/User')
const httpStatusCode = require('../utils/httpStatusCode');
const logger = require('../utils/logger');
const cloudinary = require('Cloudinary').v2;
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

class AuthController {

    async userRegister(req, res) {
        try {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            })
            const { name, email, password } = req.body

            //image uploader
            let imageURL = "";

            // 1. Check for a single file upload (usually req.file in Multer)
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "myFolder"
                });
                imageURL = result.secure_url; // Directly assign the string URL
            }
            // 2. Fallback if the single image was passed in the request body/data
            else if (req.body && req.body.image) {
                imageURL = req.body.image;
            }

            // validation check
            if (!name || !email || !password) {
                return res.status(httpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "All Fields are required"

                })
            }

            // email check
            const userExit = await user.findOne({ email })
            if (userExit) {
                return res.status(httpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "User already registered "
                })
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            //create

            const newUser = await user.create({
                name,
                email,
                password:hashedPassword,
                profileImage: imageURL
            })
            return res.status(httpStatusCode.CREATED).json({
                success: true,
                message: "User Created Successfully",
                data: newUser
            })


        } catch (err) {
            logger.error(`Registration Error: ${err.message}`);
            return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error"
            });
        }

    }

    //login

    async loginUser(req, res) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                return res.status(httpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "All Fields are required"
                })
            }
            const exist = await user.findOne({ email })
            if (!exist) {
                return res.status(httpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "User does not wxit"
                })

            }
            let ifCheck = await bcrypt.compare(String(password), exist.password)
            if (!ifCheck) {
                return res.status(httpStatusCode.FORBIDDEN).json({
                    success: false,
                    message: "Invalid Credentials"
                })
            }

            const token = JWT.sign({
                id: exist._id,
                name: exist.name,
                email: exist.email

            },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "7d" }
            )
            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Login Successfully",
                data: {
                    id: exist._id,
                    name: exist.name,
                    email: exist.email,
                },
                token: token
            })


        }
        catch (err) {
            logger.error('login Error')
        }
    }


}


module.exports = new AuthController();
