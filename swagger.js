// swagger.js
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
    info: {
        title: "CRUD API",
        description: "Product CRUD using Winston and Swagger API"
    },
    servers: [
        {
            url: "http://localhost:5000/api",
            description: "Local development server"
        }
    ]
};

const outputFile = "./swagger-output.json"; 
const endPointsFiles = ["./app/routes/indexRoute.js"]; // Double check this path matches your folder structure!

swaggerAutogen(outputFile, endPointsFiles, doc).then(() => {
    console.log("⚡ Swagger documentation successfully generated!");
});