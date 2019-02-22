const joi      =    require('joi');

/**
 * 
 * @param {driver name,phone_no,email,phone_no,pswd,vehicle_no} req 
 * @param {*} res 
 * @param {*} next 
 */
const driverInfoValidater =(req, res, next) =>{

    const emp = joi.object().keys({
        first_name: joi.string().required(),
        last_name:joi.string().required(),
        phone_no : joi.string().regex(/[0-9]{10}/).required(),
        email: joi.string().email().required(),
        password: joi.string().min(5).max(10).required(),
        confirm_password:joi.any().valid(joi.ref('password')).required(),
        vehicle_no:joi.string().required()
       
    })

    joi.validate(req.body, emp, (err, result) => {
        if (err) 
        {
            res.json(
                {
                    status: 400,
                    message: 'INVALID INFORMATION',
                    data: err.details[0].message.replace(/["]/ig, '')
                })
        }
        else 
        {
           next()
        }
    })
}
/**
 * 
 * @param {driver email,pswd} req 
 * @param {*} res 
 * @param {*} next 
 */
const valid =(req, res, next) =>{

    const emp = joi.object().keys({
        
        email: joi.string().email().required(),
        password: joi.string().min(5).max(10).required(),
        
    })

    joi.validate(req.body, emp, (err, result) => {
        if (err) 
        {
            res.json(
                {
                    status: 400,
                    message: 'INVALID INFORMATION',
                    data: err.details[0].message.replace(/["]/ig, '')
                }
         )

        }
        else 
        {
           next()
        }
    })
}



module.exports.driverInfoValidater=driverInfoValidater;
module.exports.valid=valid