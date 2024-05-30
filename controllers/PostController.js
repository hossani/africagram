const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const {BadRequestError}=require('../errors/index');

const createPost=async (req,res)=>{
    try{
        const image="/img/"+req.file.filename; 
        if(!image) throw new BadRequestError('Image est obligatoire');
        const {caption}=req.body;
        if(!caption) throw new BadRequestError('Caption est obligatoire');
        const {userId}= req.user;
        const post=await prisma.post.create({
        data: {
            utilisateur_id: userId,
            caption,
            image_url: image
          }
    });
    res.status(201).json(post);
    }catch(error){
    res.status(error.statusCode).json({message:error.message});
    }
}

const getPosts=async (req,res)=>{
    try{
        const {userId}= req.user;
    const post=await prisma.post.findMany({
        where: {
            utilisateur_id: userId,
          }
    });
    res.status(200).json(post);
    }catch(error){
    res.status(500).json({message:error.message});
    }
}

module.exports={createPost,getPosts};