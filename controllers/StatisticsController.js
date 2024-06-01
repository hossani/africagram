const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const {ForbiddenError}=require('../errors/index');

const satistics=async(req,res)=>{
    try{
        const {isAdmin}=req.user;
        if(!isAdmin) throw new ForbiddenError('Vous etes pas autoriser');
        const countUser=await prisma.utilisateur.count();
        const countPost=await prisma.post.count();
        const countPays=await prisma.profile.groupBy({
            by:['pays'],
            where:{
                pays:{
                    not:''
                }
            },
            _count:{
                pays:true
            }
        });
        const countSexe=await prisma.profile.groupBy({
            by:['sexe'],
            where:{
                sexe:{
                    not:''
                }
            },
            _count:{
                sexe:true
            }
        });
        const averagePost=countUser>0?countPost/countUser:0;
        res.status(200).json({
            nbrOfUser:countUser , nbrOfPost:countPost , nbrOfUserPerPays: countPays , 
            nbrOfUserPerSexe:countSexe , averagePostPerUser:averagePost
        })
    }catch(error){
    res.status(error.statusCode||500).json({message:error.message});
    }
}

module.exports=satistics;