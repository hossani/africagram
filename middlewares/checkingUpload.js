const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkUploadLimit = async (req, res, next) => {
  const {userId} = req.user;  

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const imageCount = await prisma.post.count({
    where: {
      utilisateur_id: userId,
      date_creation: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (imageCount == 10) {
    return res.status(400).json({ error: 'Vous avez depasser le nombre 10 upload image' });
  }

  next();
};

module.exports=checkUploadLimit;

