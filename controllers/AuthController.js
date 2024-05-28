const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const joi =require('joi');
const loginSchema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(6).required()
});
const {UnauthenticatedError,BadRequestError}=require('../errors/index');
const register=async (req,res)=>{
    try{
     
    }catch(error){
        console.log('Error : ',error);
        res.status(500).json({ error: 'Echec de connexion' }); // Erreur Interne du Serveur
    }

}
const login=async (req,res)=>{
    try{
        const {error}=loginSchema.validate(req.body);
        if(error) throw new BadRequestError('Données saisies invalides');
        const {email,password}= req.body;
        const user=await prisma.utilisateur.findUnique({
            where:{email}
        });
        if(!user || bcrypt.compare(password,user.password)) throw new UnauthenticatedError('Identifiants invalides');
        const token=jwt.sign({firstname:user.firstname, lastname:user.lastname,email ,isAdmin:user.isAdmin},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token});
    }catch(error){
        console.log('Error : ',error);
        res.status(500).json({ error: 'Echec de connexion' }); // Erreur Interne du Serveur
    }

}

module.exports={login,register};