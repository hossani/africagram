const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const joi =require('joi');
require('dotenv').config();
const {UnauthenticatedError,BadRequestError}=require('../errors/index');
const {loginSchema,UserSchema}=require('../middeleware/shemavalidation'); 


const register=async (req,res)=>{
    try{
        const { error } =registerSchema.validate(req.body);

        if (error) {
          return res.status(400).json({ Erreur: error.details[0].message });
        }
        const {firstname ,lastname,email,password,isAdmin,date_creation ,
            date_modification,profile }=req.body;

        const existingUser = await prisma.utilisateur.findUnique({
                where: { email },
              });
          
        if (existingUser) {
                return res.status(409).json({ error: 'Email already exists' });
              }
        const Encryptedpassword = await bcrypt.hash(password,10)
        const  User = await prisma.Utilisateur.create({
            data:{
                firstname,
                lastname,
                email,
                password:  Encryptedpassword,
                isAdmin,
                date_creation,
                date_modification,
                profile
            }
        })
        const token = jwt.sign({ userId: User.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        User.token = token;

        res.json(User); 

    }catch(error){
        console.log('Error : ',error);
        res.status(500).json({ error: 'Echec de connexion' }); 
    }

}

const update = async (req, res) => {
    try {
      const { error } = UserSchema.validate(req.body);
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { userId } = req.params;
      const {  firstname, lastname, email, password, isAdmin, date_modification, profile } = req.body;
  
      // Conversion de l'ID en nombre entier
      const userIdAsNumber = Number(userId);
  
      const existingUser = await prisma.Utilisateur.findUnique({
        where: { id: userIdAsNumber },
      });
  
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      const existingEmailUser = await prisma.Utilisateur.findFirst({
        where: { email },
      });
  
      if (existingEmailUser && existingEmailUser.id!== userIdAsNumber) {
        return res.status(409).json({ error: 'Email already exists' });
      }
  
      if (email!== existingUser.email ||!email) {
        const Encryptedpassword = await bcrypt.hash(password, 10);
        const update = await prisma.Utilisateur.update({
          where: { id: userIdAsNumber },
          data: {
            firstname,
            lastname,
            email,
            password: Encryptedpassword,
            isAdmin,
            date_modification,
            profile,
          },
        });
  
        const token = jwt.sign({ userId: update.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        update.token = token;
  
        res.json(update);
      } else {
        return res.status(400).json({ error: 'Email cannot be changed' });
      }
    } catch (error) {
      console.log('Error : ', error);
      res.status(500).json({ error: 'Server Internal Error' });
    }
  };
  
  
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

module.exports={login,update,register};