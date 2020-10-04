/* 
    *@author:Naveen Kumar,
    *@createdDate:03/10/2020

*/


import * as yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
let authSchema =
  yup.object().shape({
    userName: yup.string().required(),
    userRole: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    phoneNo: yup.string().min(10).max(10).matches(phoneRegExp, 'Phone number is not valid'),
    salary:yup.number()
  })




module.exports = authSchema