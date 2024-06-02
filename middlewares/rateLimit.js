const rateLimit = require('express-rate-limit');

const logLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 5, 
  message: 'Trop de tentatives de connexion, veuillez réessayer après 5 minutes',
});

const followLimiter = rateLimit({
  windowMs: 5 * 60 * 60 * 1000, 
  max: 10, 
  message: 'Trop de tentatives de création de posts, veuillez réessayer après 5 minutes',
});

module.exports = { logLimiter, followLimiter};
