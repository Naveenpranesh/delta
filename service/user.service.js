/* 
    *@author:Naveen Kumar,
    *@createdDate:03/10/2020

*/

import * as jwt from "jsonwebtoken";

import config from '../config.json';
import db from '../config/db.js';
import bcrypt from 'bcrypt'


const User = db.User;

module.exports = {
    signIn,
    register,
    addEmployee,
    getAll
}

async function signIn(req, res) {                               //Function for Login
    try {
        let user = await User.findOne({                          //checking whether the given email is present or not in db
            email: req.email
        })

        if (user && bcrypt.compareSync(req.password, user.hash)) { //comparing input password with db hash
            let token = jwt.sign({
                sub: user
            }, config.secret, {
                expiresIn: '1d'                                 //token expiration time
            })
            res.status(200).json({
                User_data: user,
                Bearer_token: token
            });
        } else {
            res.status(404).json({
                message: "User Not Found",
                status: 404
            })
        }
    } catch (err) {
        console.log(err);
    }

}

async function register(req, res) {
    try {
        let {
            id,
            userRole,
            email,
            password,
            userName
        } = req                                             //getting only the required feild from the user
        let user = await User.findOne({
            email: email
        })
        if (!user) {

            if (password) {
                let signUp = {
                    id,
                    userRole,
                    email,
                    password,
                    userName
                }

                const new_user = new User(signUp);
                new_user.hash = bcrypt.hashSync(password, 10);      //encrypt the password field
                new_user.save();
                return res.status(200).json({
                    message: 'Sign up Done',
                    statusCode: 200
                })
            } else {
                return res.status(401).json({
                    message: 'Password Field is Mandatory',
                    statusCode: 401
                })
            }
        } else {
            return res.status(409).json({
                message: 'Oopsy! This email is aldready taken',
                statusCode: 409
            })
        }
    } catch (err) {

        res.send(err)
    }
}

async function addEmployee(req, token, res) {
    try {
        jwt.verify(token, config.secret, async (err, authData) => {
            if (err) {
                res.send(err);
            }
            if (authData.sub.userRole === 'Admin' || authData.sub.userRole === 'Manager') { //allowing only employee by admin and manager user roles only.


                let {
                    userRole,
                    email,
                    password,
                    phoneNo,
                    salary,
                    userName
                } = req
                console.log(authData.sub)
                                //getting only the required feild from the user
                    let user = await User.findOne({
                        email: email
                    })
                    if (!user) {
                        if (password) {
                            let signUp = {
                                userRole,
                                email,
                                password,
                                phoneNo,
                                salary,
                                userName
                            }
                            const new_user = new User(signUp);
                            new_user.hash = bcrypt.hashSync(password, 10);
                            new_user.save();
                            return res.status(200).json({
                                message: 'Employee Created Sucessfully.',
                                statusCode: 200
                            })
                        } else {
                            return res.status(401).json({
                                message: 'Password Field is Mandatory.',
                                statusCode: 401
                            })
                        }
                    } else {
                        return res.status(409).json({
                            message: 'Oopsy! This email is aldready taken.',
                            statusCode: 409
                        })
                    }
               
            }
            else{
                return res.status(403).json({
                    message: 'You are not allowed',
                    statusCode: 403
                })
            }
        })
    } catch (err) {
        res.send(err)
    }
}

async function getAll(req, res, next) {
    try {
        jwt.verify(req.token, config.secret, async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            }
            let user = await User.aggregate([{      //to project the users details based on the userRoles
                $project: {
                    _id: false,
                    userName: true,
                    email: true,
                    userRole: {
                        $cond: {
                            if: {

                                $or: [{
                                    $eq: [authData.sub.userRole, 'Admin'],
                                }, {
                                    $eq: [authData.sub.userRole, 'Manager'],
                                }]
                            },
                            then: "$userRole",
                            else: "$$REMOVE"

                        },
                    },
                    salary: {
                        $cond: {
                            if: {
                                $eq: [authData.sub.userRole, 'Admin']
                            },
                            then: "$salary",
                            else: "$$REMOVE"
                        },
                    },
                    phoneNo: {
                        $cond: {
                            if: {

                                $or: [{
                                    $eq: [authData.sub.userRole, 'Admin'],
                                }, {
                                    $eq: [authData.sub.userRole, 'Manager'],
                                }]
                            },
                            then: "$phoneNo",
                            else: "$$REMOVE"

                        },

                    },
                    createdDate: true

                },

            }]);
            res.status(200).json({
                statusCode: 200,
                data: user
            })
        })
    } catch (err) {
        res.send(err)
    }
}