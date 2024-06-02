const appRoutes = require('app-root-path');
const winston = require('winston');

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: `${appRoutes}/logs/error.log`, // Correction ici
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json()
      ),
      handleExceptions: true
    })
  ]
});

const infoLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: `${appRoutes}/logs/info.log`,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json()
      ),
      handleExceptions: true
    })
  ]
});

module.exports = { errorLogger, infoLogger };
