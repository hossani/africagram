const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const {UnauthenticatedError,BadRequestError,NotFoundError,ConflictError}=require('../errors/index');
const {loginSchema,UserSchema}=require('../helpers/shemavalidation'); 

const register=async (req,res)=>{
    try{
        const { error } =UserSchema.validate(req.body);

        if (error) throw new BadRequestError('Données saisies invalides');  
        const {firstname ,lastname,email,password,isAdmin }=req.body;

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
       
        User={firstname:User[0].firstname,
        lastname:User[0].lastname, token
        };
        res.status(201).json(User); 

    }catch(error){
        // console.log(error instanceof ConflictError);
        res.status(error.statusCode||500).json({ error: error.message }); 
    }
}

const login=async (req,res)=>{
    try{
        const {error}=loginSchema.validate(req.body);
        if(error) throw new BadRequestError('Données saisies invalides');
        const {email,password}= req.body;
        let user=await prisma.utilisateur.findUnique({
            where:{email}
        });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!user || !isPasswordValid) throw new UnauthenticatedError('Identifiants invalides');
        const token=jwt.sign({userId: user.id,isAdmin:user.isAdmin},process.env.JWT_SECRET,{expiresIn:'1h'});
        user={firstname:user.firstname,
          lastname:user.lastname, token
          };
          res.status(200).json(user); 
    }catch(error){
      res.status(error.statusCode||500).json({ error: error.message }); 
    }
}

module.exports={login,register};