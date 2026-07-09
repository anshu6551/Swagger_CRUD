// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const indexRoute = require('./app/routes/indexRoute');
const swaggerUI = require('swagger-ui-express');
const swaggerdoc = require('./swagger-output.json');

dotenv.config();

const app = express();

// 1. Fixed CORS configuration 
const allowedOrigins = ["http://localhost:5000"];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// 2. Static Folder for Images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Swagger API Docs Setup (Points to the compiled JSON)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerdoc));

// 4. App Routes
app.use('/api', indexRoute);

// 5. Base Root Route
app.get('/', (req, res) => {
    res.send("Winston with Swagger APIs");
});

// 6. Database Connection
if (!process.env.MONGODB_URL) {
    console.error("FATAL ERROR: MONGODB_URL is not defined in .env file.");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log(" Database Connected Successfully to MongoDB"))
    .catch(err => console.error(" Database Connection Error: ", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));