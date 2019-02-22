var express       =   require('express');
const router      =   express.Router();
const controller  =   require('./controller/drivercontroller')
const validator   =   require('./validations/driver_validation')
const auth        =   require('./validations/authorization/driverauthorization')
const service     =   require('./service/driverservice')

//driver routes
router.post('/signup',              validator.driverInfoValidater,  controller.checkDriverEmail,       auth.createHash,        controller.signup)
router.post('/login',               validator.valid,                auth.checkDriver,                  auth.tokengen,          controller.driverDetails)
router.get('/showallbooking/:token',auth.verifytokn,                controller.showAllBooking)
router.get('/completebooking/:token',auth.verifytokn,               controller.driverOngoingDetails,   controller.logDetails,   controller.makeDriverFree)

module.exports=router;