
const adminService       =        require('../admin/services/admin_service')
const response           =        require('../properties/constant')
const Promise            =        require('bluebird')

//insert admindata
module.exports.addAdminData=(req,res)=>
{
Promise.coroutine(function* () {
    let flag=yield adminService.checkData() //checkadmin already exist
    if(flag[0]==undefined)
    {
  let result = yield adminService.insertAdminDetails()//insert admin
  }
})().catch((err)=>{
res.json({
  status:response.responseFlags.BAD_REQUEST,
  message:response.responseMessages.ADMIN_INSERTION_PROBLEM
})
})}