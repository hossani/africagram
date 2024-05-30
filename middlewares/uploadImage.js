const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
destination: function(req, file, cb) {
cb(null,'uploads');
},
filename: (req, file, cb) => {
const name = file.originalname.split(' ').join('_');
cb(null, name);
}
});

const upload = multer({
storage: storage,
limits: { fileSize: 5000000 }, // Limite la taille du fichier à 5MB
fileFilter: function(req, file, cb) {
checkFileType(file, cb);
}
});

function checkFileType(file, cb) {
const filetypes = /jpeg|jpg|png|gif/;
const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
const mimetype = filetypes.test(file.mimetype);

if (mimetype && extname) {
return cb(null, true);
} else {
console.log('File type check failed:', file.originalname);
console.log('Expected file types:', filetypes);
console.log('Received mimetype:', file.mimetype);
cb(new Error('Error: Images Only'));
}
}

module.exports = upload; // Exportez l'instance de multer