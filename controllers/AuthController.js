const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const {UnauthenticatedError,BadRequestError,NotFoundError,ConflictError}=require('../errors/index');
const {loginSchema,UserSchema}=require('../helpers/shemavalidation'); 
const twilio = require('twilio');
const {sendOtp,generateOTP}=require('../helpers/methodOTP');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const {errorLogger,infoLogger}=require('../helpers/logWinston');

const register=async (req,res)=>{
    try{
        const { error } =UserSchema.validate(req.body);

        if (error){
            const errorMessage=error.details[0].message;
            throw new BadRequestError(`Données saisies invalides:${errorMessage}`); 
        } 
        const {firstname ,lastname,email,password,isAdmin,phoneNumber }=req.body;

        const existingUser = await prisma.utilisateur.findUnique({
                where: { email },
              });
          
        if (existingUser)  throw new ConflictError('Email déjà existe');
        const Encryptedpassword = await bcrypt.hash(password,10);
     let User= await prisma.$transaction([
            prisma.utilisateur.create({
                data: {
                    firstname,
                    lastname,
                    email,
                    password: Encryptedpassword,
                    isAdmin,
                    phoneNumber
                },
            }),
            prisma.profile.create({
                data: {
                    utilisateur: {
                        connect: { email }
                    }
                },
            }),
        ]);
        const token = jwt.sign({ userId: User[0].id,isAdmin:User[0].isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const userEmail=User[0].email;
        User={firstname:User[0].firstname,
        lastname:User[0].lastname, token
        };
        res.status(201).json(User); 
        infoLogger.info(`Utilisateur enregistré : ${userEmail}`);
    }catch(error){
        // console.log(error instanceof ConflictError);
        errorLogger.error(`Erreur lors de l'enregistrement : ${error.message}`);
        res.status(error.statusCode||500).json({ error: error.message }); 
    }
}

const login=async (req,res)=>{
    try{
        const user = req.user;
        const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
        res.status(200).json({
          firstname: user.firstname,
          lastname: user.lastname,
          token
        });
        infoLogger.info(`Utilisateur connecté : ${user.email}`);
    }catch(error){
      errorLogger.error(`Erreur lors de la connexion : ${error.message}`);
      res.status(error.statusCode||500).json({ error: error.message }); 
    }
}

const loginOTP = async (req, res) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error){
        const errorMessage=error.details[0].message;
        throw new BadRequestError(`Données saisies invalides:${errorMessage}`); 
    } 
      const { email, password } = req.body;
  
      let user = await prisma.utilisateur.findUnique({
        where: { email },
      });
  
      if (!user) throw new UnauthenticatedError('Identifiants invalides');
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new UnauthenticatedError('Identifiants invalides');
  
      const otp = generateOTP();
      const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP valide pendant 10 minutes
  
      await prisma.utilisateur.update({
        where: { email },
        data: { otp, otpExpiration }
      });
  
      await sendOtp(user.phoneNumber, otp);
  
      res.status(200).json({ message: 'OTP envoyé, veuillez vérifier votre téléphone', userId: user.id });
} catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };


module.exports={login,register,loginOTP};