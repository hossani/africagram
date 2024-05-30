const jwt = require('jsonwebtoken');
const {UnauthenticatedError,ForbiddenError} = require('../errors/index');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        if (!token) throw new UnauthenticatedError('Pas de token fourni');
    
        // const verified = jwt.verify(token, process.env.JWT_SECRET,(err) => {
        //     if (err)  throw new ForbiddenError('Échec de l\'authentification du token');
        //     });
        const verified = jwt.verify(token, process.env.JWT_SECRET); 
        console.log(verified);
        req.user = verified;
        next();
    } catch (error) {
        res.status(error.statusCode||403).json({ error: error.message });
    }
}

module.exports = verifyToken;
