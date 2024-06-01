const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {NotFoundError,BadRequestError}=require('../errors/index');
const {profileSchema}=require('../helpers/shemavalidation');
const getProfile = async (req, res) => {
    try {
        const { userId } = req.user; 
        const profile = await prisma.profile.findUnique({
            where: {
                utilisateur_id : userId,
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
        if (error) {
            const errorMessage = error.details[0].message;
            throw new BadRequestError(`Données saisies invalides: ${errorMessage}`);
        }
        const { sexe, pays, ville } = req.body;
        const updatedProfile = await prisma.profile.update({
            where: {
                utilisateur_id : userId,
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
