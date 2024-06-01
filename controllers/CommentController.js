const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {NotFoundError}=require('../errors/index');

const commentCreate = async (req, res) => {
 
  try {
    const {userId}=req.user;
    const {message}=req.body;
    const {postId } = req.params;  
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) throw new NotFoundError('Post non trouver');
    const comment=await prisma.commentaire.create({
    data: {
        utilisateur_id :userId,
        post_id:Number(postId),
      message
    },
  });

  res.status(201).json(comment); 
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};

const commentGet = async (req, res) => {
 try {
      const {userId}=req.user;
  
      const comment=await prisma.commentaire.findMany({
      where: {
          utilisateur_id :userId,
      },
    });
    if(!comment.length) res.status(200).json({message:'Aucun comment detecter'});
    res.status(200).json(comment); 
    } catch (error) {
      res.status(500).json({message:error.message});
    }
  };
module.exports = {commentGet,commentCreate} ;
