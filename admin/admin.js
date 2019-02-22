              
const express        =          require('express');
const router         =          express.Router();
const controller     =          require('../admin/controller/admin_controller')
const auth           =          require('../admin/validations/authorization/admin_authorization')
const validater      =          require('../admin/validations/admin_validation')
const service        =          require('../admin/services/admin_service')

//admin routes
router.post('/login',                     validater.adminInfoValidater,  auth.checkAdmin,                 auth.tokenGen,           controller.printAdminDetails)
router.get('/showbookings/:token/:status',auth.verifyTokn,               controller.printAllBooking)
router.get('/assigndriver/:token',        auth.verifyTokn,               controller.assignDriver,          controller.showDriverAssign)

module.exports=router