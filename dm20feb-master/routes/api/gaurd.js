const jwt = require('jsonwebtoken');
const config = require('./../../utils/configs');

module.exports = ( req, res, next ) => {
    const authHeader = req.get('Authorization');
    if ( !authHeader ) {
        res.status(401).json({message: 'Not authenticated.'});
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, config.jwtSecret);
    } catch (error) {
        console.log({error});
        res.status(500).json({message: error});
    }

    if( !decodedToken ) {
        res.status(401).json({message: "Not authenticated"});
    }
    req.userId = decodedToken.userId;
    next();
}


