const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {postIdSchema}=require('../helpers/shemavalidation');
const {BadRequestError}=require('../errors/index');

const commentCreate = async (req, res) => {
 
  try {
    const {userId}=req.user;
    const {post_id,message}=req.body;
    const {error}=postIdSchema.test(post_id);
    if (error) throw new BadRequestError('Données saisies invalides');  
    const comment=await prisma.follower.create({
    data: {
        utilisateur_id :userId,
        post_id,
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
  
      const comment=await prisma.follower.findMany({
      data: {
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
