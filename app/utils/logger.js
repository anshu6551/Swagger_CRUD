const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Kis level tak ke logs capture karne hain
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Logs ko JSON format mein save karega
  ),
  transports: [
    // 1. Saare errors is file mein jayenge
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // 2. Saare normal + error logs is file mein jayenge
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Agar development mode hai, toh terminal par bhi color ke sath dikhao
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;