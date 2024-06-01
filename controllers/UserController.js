const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { BadRequestError, NotFoundError } = require('../errors');
const UserSchema=require('../helpers/userValidation'); 

const getUser = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await prisma.utilisateur.findUnique({
            where: { id: userId },
        });

        if (!user) throw new NotFoundError('Utilisateur non trouvé');

        res.status(200).json(user);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId } = req.user;
        const { error } =UserSchema.validate(req.body);

        if (error){
            const errorMessage=error.details[0].message;
            throw new BadRequestError(`Données saisies invalides:${errorMessage}`); 
        } 
        const { firstname, lastname, email, password, isAdmin } = req.body;

        const existingUser = await prisma.utilisateur.findUnique({
            where: { id: userId },
        });
        if (!existingUser) throw new NotFoundError('Utilisateur non trouvé');

        // Mettre à jour l'utilisateur dans la base de données
        const updatedUser = await prisma.utilisateur.update({
            where: { id: userId },
            data: {
                firstname,
                lastname,
                email,
                password,
                isAdmin,
            },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

// Supprimer un utilisateur 
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.user;

        const existingUser = await prisma.utilisateur.findUnique({
            where: { id: userId },
        });
        if (!existingUser) throw new NotFoundError('Utilisateur non trouvé');
        const aimes=await prisma.aime.findMany({
            where:{
                utilisateur_id :userId
            }
        });
        const idPost=aimes.map(a=>a.post_id);
        await prisma.$transaction([
            prisma.post.updateMany({
                where:{
                    id:{
                        in:idPost
                    }
                },
                data: {
                    total_likes: {
                    decrement: 1,
                    },
                },
            }),
            prisma.aime.deleteMany({
                where: { utilisateur_id : userId } 
            }),
            prisma.post.deleteMany({
                where: { utilisateur_id : userId } 
            }),
            prisma.follower.deleteMany({
                where: { follower_id: userId } 
            }),
            prisma.Commentaire.deleteMany({
                where: { utilisateur_id : userId } 
            }),
             prisma.profile.delete({
                where: { utilisateur_id : userId }
            }),
            prisma.utilisateur.delete({
                where: { id: userId }
            }),
        ]);

        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};
module.exports = {getUser, updateUser, deleteUser };
