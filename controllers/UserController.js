const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { BadRequestError, NotFoundError } = require('../errors');
const {UserSchema}=require('../helpers/shemavalidation'); 

const getUser = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await prisma.utilisateur.findUnique({
            where: { id: userId },
        });

        if (!user) throw new NotFoundError('Utilisateur non trouvé');

        res.json(user);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId } = req.user;
        const { error } =UserSchema.validate(req.body);

        if (error) throw new BadRequestError('Données saisies invalides'); 
        const { firstname, lastname, email, password, isAdmin } = req.body;

        // Vérifier si l'utilisateur existe
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

        res.json(updatedUser);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

// Supprimer un utilisateur par son ID
const deleteUserById = async (req, res) => {
    try {
        const { userId } = req.user;

        // Vérifier si l'utilisateur existe
        const existingUser = await prisma.utilisateur.findUnique({
            where: { id: userId },
        });
        if (!existingUser) throw new NotFoundError('Utilisateur non trouvé');

        // Supprimer l'utilisateur et son profil dans une transaction
        await prisma.$transaction([
            prisma.utilisateur.delete({
                where: { id: userId }
            }),
            prisma.profile.delete({
                where: { id_utilisateur: userId }
            })
        ]);

        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

module.exports = {getUser, updateUser, deleteUserById };
