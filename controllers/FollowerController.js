const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Suivre un utilisateur
const followUser = async (req, res) => {
 
  try {
    const {following_id} = req.params;
    const {userId}=req.user;
    // Vérifier si la relation de suivi existe déjà
    const existingRelation = await prisma.follower.findFirst({
      where: {
        following_id:parseInt(following_id),
        follower_id:userId
      },
    });
    if(existingRelation){
        await prisma.follower.delete({
            where:{
                id:existingRelation.id
            }
        });
        res.status(200).json({message:'You did an unfollow to ur following'}); // Répondre avec la nouvelle relation de suivi créée

    } else{
      // Créer une nouvelle relation de suivi
    await prisma.follower.create({
    data: {
      following_id:parseInt(following_id),
      follower_id:userId
    },
  });
  res.status(201).json({message:'You did a follow to ur following'}); // Répondre avec la nouvelle relation de suivi créée
    }
    
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};

module.exports = followUser ;
