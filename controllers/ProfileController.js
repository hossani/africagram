const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const joi =require('joi');
require('dotenv').config();
const {UnauthenticatedError,BadRequestError,NotFoundError,ConflictError}=require('../errors/index');
const {UserSchema}=require('../helpers/shemavalidation'); 

const updateProfile = async (req, res) => {
    try {
      const { error } = UserSchema.validate(req.body);
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { userId } = req.params;
      const {  firstname, lastname, email, password, isAdmin } = req.body;
  
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
            isAdmin
          },
        });
  
        const token = jwt.sign({ userId: update.id }, process.env.c, { expiresIn: '1h' });
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


  module.exports={updateProfile};