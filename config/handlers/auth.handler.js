import db from '../db';
const User = db.User;
var user = [];

module.exports = {
    setUser,
    login_check,
    verifyToken,
    authRole
}

async function setUser(req, res, next) {

    const userEmail = req.body.email
    if (userEmail) {
        await User.findOne({
            email: userEmail
        }, async function (err, res) {
            if (err) {
                console.log(err)
            }
            await user.push(res)

        });
        req.user = user[0]

    }
    next();
}

function login_check(req, res, next) {

    if (req.user === null) {
        return res.status(403).json({
            message: 'You need to sign In.',
            statusCode: 403
        });
    }
    next();
}

function authRole(req, res, next) {

    if (req.user.userRole === 'Admin' || req.user.userRole === 'Manager') {
        next();
    } else {
        return res.status(403).json({
            message: "ADMIN or  MANAGER is only allowed.",
            statusCode: 403
        });

    } 

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