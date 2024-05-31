const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const {NotFoundError}=require('../errors/index');

const newsFeed=async(req,res)=>{
    try{
        const {userId}=req.user;
        const {cursor}=req.query;
        const following =await prisma.follower.findMany({
            where:{
                follower_id:userId
            }
        });
        const followingIds = following.map(f => f.following_id);
        if(cursor){
             resultsPost = await prisma.post.findMany({
                take: 5,
                cursor: {
                    id: parseInt(cursor),
                  },
                where: {
                    utilisateur_id:{
                        in:followingIds
                    }
                },
                orderBy: {
                    date_modification: 'desc',
                },
              });  
              if(!resultsPost.length) throw new NotFoundError('Aucun resultat trouvé avec le curseur spécifié');
        }else{
             resultsPost = await prisma.post.findMany({
                take: 5,
                where: {
                    utilisateur_id:{
                        in:followingIds
                    }
                },
                orderBy: {
                    date_modification: 'desc',
                },
              });
              if(!resultsPost.length) res.status(200).json({message:'Aucun post detecter'});
        }
        res.status(200).json(resultsPost);
    }catch(error){
        res.status(error.statusCode||500).json({message:error.message});
    }
}

module.exports=newsFeed;