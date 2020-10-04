/* 
    *@author:Naveen Kumar,
    *@createdDate:03/10/2020

*/


require('rootpath')();
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';

import errorHandler from './config/handlers/error.handler.js';
import users from './routes/user.controller';

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use('/users', users);

app.use(errorHandler);

const port = process.env.NODE_ENV ==='production' ? 80 : 8000;

process.setMaxListeners(Infinity);

app.listen(port, () => {
    console.log(`app is listening to port ${port}`);
})