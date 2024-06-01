const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split(' ').join('_');
        cb(null, name);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // Limite la taille du fichier à 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Exemple pour images
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

         if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers image sont autorisés!'));
        }
    }
});

module.exports = upload; // Exporter l'instance de multer
