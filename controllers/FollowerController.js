const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {NotFoundError,BadRequestError} = require('../errors/index');

const followUser = async (req, res) => {

  try {
    const {following_id} = req.params;
    const {userId}=req.user;
    if(userId==parseInt(following_id)) throw new BadRequestError('Vous pouvez pas faire follow à votre compte');
    const existingRelation = await prisma.follower.findFirst({
      where: {
        following_id:parseInt(following_id),
        follower_id:userId
      },
    });
    const checking =await prisma.utilisateur.findUnique({where:{id:parseInt(following_id)}});
    if(!checking)   throw new NotFoundError('Il n y\'a aucun follower dans le chemin demandés');
    if(existingRelation){
        // Annuler une nouvelle relation de suivi
        await prisma.follower.delete({
            where:{
                id:existingRelation.id
            }
        });
        res.status(200).json({message:'Vous avez annuler votre follow'}); 

    } else{
      // Créer une nouvelle relation de suivi
   await prisma.follower.create({
    data: {
      following_id:parseInt(following_id),
      follower_id:userId
    },
  });
  res.status(201).json({message:'Vous avez fait un follow'}); 
    }
  } catch (error) {
    res.status(error.statusCode||500).json({message:error.message});
  }
};

const getFollower=async(req,res)=>{
  try {
    const {userId}=req.user;
    const follow=await prisma.follower.findMany({
      where:{
        follower_id:userId
      }
    });
    if(follow.length==0)  {res.status(200).json({message:'Vous avez pas fait aucun follow '}); } 
    else{
  res.status(200).json(follow); }
  } catch (error) {
    res.status(error.statusCode||500).json({message:error.message});
  }
}

module.exports = {getFollower,followUser} ;
