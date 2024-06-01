const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {NotFoundError}=require('../errors/index');

const likePost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;  

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) throw new NotFoundError('Post non trouver');

    const existingLike = await prisma.aime.findFirst({
      where: {
        utilisateur_id: userId,
        post_id: Number(postId),
      },
    });

    if (!existingLike) {
      await prisma.$transaction([
        prisma.aime.create({
          data: {
            utilisateur_id: userId,
            post_id: Number(postId),
          },
        }),
        prisma.post.update({
          where: {
            id: Number(postId),
          },
          data: {
            total_likes: {
              increment: 1,
            },
          },
        }),
      ]);
      newLike = true;
    } else {
      await prisma.$transaction([
        prisma.post.update({
          where: {
            id: Number(postId),
          },
          data: {
            total_likes: {
              decrement: 1,
            },
          },
        }),
        prisma.aime.delete({
          where: {
            id: existingLike.id,
          },
        }),
      ]);
      newLike = false;
    }
    
    if (newLike) {
      res.status(201).json({ message: 'Like ajouter avec succès' });
    } else {
      res.status(200).json({ message: 'Like annuler avec succès' });
    }
  } catch (error) {
    res.status(error.statusCode||500).json({ message: error.message });
  }
};

const likeGet = async (req, res) => {
  try {
       const {userId}=req.user;
   
       const likes=await prisma.aime.findMany({
       where: {
           utilisateur_id :userId,
       },
     });
     if(!likes.length) {res.status(200).json({message:'Aucun LIKE detecter'});}
     else{
      res.status(200).json(likes); 
     }
     } catch (error) {
       res.status(500).json({message:error.message});
     }
   };

module.exports = {likePost,likeGet};
