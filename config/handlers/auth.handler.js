import db from '../db';
const User = db.User;
var user = [];

module.exports = {
    verifyToken
}


async function verifyToken(req, res, next) {
    //get Auth header value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;

        next()
    }
    else {
        res.sendStatus(403);
    }
}