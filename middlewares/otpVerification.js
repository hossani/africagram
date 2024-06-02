const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { UnauthenticatedError } = require('../errors/index');

const otpMiddleware = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Recherchez l'utilisateur par email
    const user = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthenticatedError('Identifiants invalides');

    // Si l'OTP n'est pas fourni ou est incorrect
    if (!otp || user.otp !== otp || user.otpExpiration < new Date()) {
      throw new UnauthenticatedError('OTP invalide ou expiré');
    }

    // Nettoyez l'OTP et son expiration de l'utilisateur
    await prisma.utilisateur.update({
      where: { email },
      data: { otp: null, otpExpiration: null }
    });

    req.user = user; // Stockez l'utilisateur dans la requête pour l'étape suivante
    next();
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = otpMiddleware;
