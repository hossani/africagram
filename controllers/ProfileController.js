const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {NotFoundError,BadRequestError}=require('../errors/index');
const {profileSchema}=require('../helpers/shemavalidation');
const getProfile = async (req, res) => {
    try {
        const { userId } = req.user; 
        const profile = await prisma.profile.findUnique({
            where: {
                id_utilisateur: userId,
            },
        });
        
        if (!profile) throw new NotFoundError('Profil non trouvé');
      
        res.status(200).json(profile);
    } catch (error) {
        res.status(error.statusCode||500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId } = req.user; 
        const {error}=profileSchema.validate(req.body);
        if (error) throw new BadRequestError(error.details);  
        const { sexe, pays, ville } = req.body;
        const updatedProfile = await prisma.profile.update({
            where: {
                id_utilisateur: userId,
            },
            data: {
                sexe,
                pays,
                ville,
            },
        });
        if (!updatedProfile) throw new NotFoundError('Profil non trouvé');
        res.status(200).json(updatedProfile);
    } catch (error) {
      res.status(error.statusCode||500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
};
