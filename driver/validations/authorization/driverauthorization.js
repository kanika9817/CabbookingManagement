const bcrpyt    =  require('bcrypt')
const jwt       =  require('jsonwebtoken')
const saltrounds=  10
const service    =       require('../../service/driverservice')
const config     =       require('../../../config/test')


//func to createhash
module.exports.createHash=(req,res,next)=>
{ 
    bcrpyt.hash(req.body.password, saltrounds).then(function(hash) {
        req.body.password=hash;
        next();
    });


}
//to check driver exist
async function checkDriver(req,res,next) {

     let data=await service.check(req,res)/* check email of driver */
     console.log(data)
     const match =await bcrpyt.compare(req.body.password,data);
     if(match)
     {
     next()
     }
     
     else
     {res.json({
        status:response.responseFlags.INVALID_PASSWORD,
        message: INVALID_PASSWORD,
       
    })
 }}
 //func to gen token
 module.exports.tokengen=(req,res,next)=>
{  

jwt.sign({email:req.body.email},config.toknKeys[0].driverKey,(err,data)=>
{
if(err)
{
    res.json({
        status:response.responseFlags.BAD_REQUEST,
        message:response.responseMessages.BAD_REQUEST
       })
}
else
{ req.body.token=data;
    next()
}
})

}

//func to verfiy token
module.exports.verifytokn=(req,res,next)=>
{
    jwt.verify(req.params.token,config.toknKeys[0].driverKey,(err, decoded)=> {
        if (err) 
        {
            res.json({
                status:response.responseFlags.INVALID_TOKEN,
                message:response.responseMessages.INVALID_TOKEN
            })
        }
        else{
        req.email=decoded.email
            next()
        
        }
      });
}


 
module.exports.checkDriver=checkDriver
