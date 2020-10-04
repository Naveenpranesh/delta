/* 
    *@author:Naveen Kumar,
    *@createdDate:03/10/2020

*/

import * as config from '../config.json';
import mongoose from 'mongoose';

const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);

mongoose.set('useUnifiedTopology', true);

mongoose.Promise = global.Promise;

module.exports = {
    User: require('./default/user.model')
};