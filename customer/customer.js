var express       =   require('express');
const router      =   express.Router();
const controller  =   require('../customer/controller/usercontroller')
const validator   =   require('../customer/validations/validation')
const auth        =   require('../customer/validations/authorization/authorization')
const service     =   require('../customer/service/userservice')
//customer routes
router.post('/signup',validator.userValidater,  controller.checkUserEmail,  auth.createPswdHash,  controller.customerSignup)
router.post('/login', validator.Valid,       auth.checkUser,    auth.genrateToken,  controller.printCustomerDetails)
router.put('/createbooking/:token',auth.verifytokn,validator.bookingValidator,controller.addbooking)


module.exports=router;