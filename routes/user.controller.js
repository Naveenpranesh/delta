/* 
    *@author:Naveen Kumar,
    *@createdDate:03/10/2020

*/


import express from "express";
import { verifyToken } from '../config/handlers/auth.handler';
import authSchema from '../config/handlers/field.validation';
import userService from '../service/user.service';

const router = express.Router();

router.post('/signIn', authenticate);
router.post('/addEmployee', verifyToken, addEmployee);
router.post('/signUp', verifyToken, signUp);
router.get('/getAll', verifyToken, getAll);

function signUp(req, res, next) {
    try {
        authSchema.validate(req.body)
            .then(function (req) {
                userService.register(req, res)
            })
            .catch(err => res.status(400).send(err));
    }
    catch (err) {
        throw err
    }
};

function authenticate(req, res, next) {
    try {
        authSchema.validate(req.body)
            .then(function (req) {
                userService.signIn(req, res)
            })
            .catch(err => res.status(400).send(err));
    }
    catch (err) {
        throw err
    }
};

function addEmployee(req, res, next) {
    try {
        let token = req.token;
        authSchema.validate(req.body)
            .then(function (req) {
                userService.addEmployee(req, token, res)
            })
            .catch(err =>
                res.status(400).send(err)
            );
    }
    catch (err) {
        throw err
    }
};

function getAll(req, res, next) {
    try {
        userService.getAll(req, res, next);
    }
    catch (err) {
        throw err
    }
}


module.exports = router;