const joi = require('joi')

/**
 * validate schema
 * @param {email,pswd} req 
 * @param {*} res 
 *
 */
const adminInfoValidater = (req, res, next) => {
    
    const emp = joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().min(5).max(10).required(),

    })

    joi.validate(req.body, emp, (err, result) => {
        if (err) {
            res.json(
                {
                    status: 400,
                    message: 'invalid information',
                    data: err.details[0].message.replace(/["]/ig, '')
                }
            )

        }
        else {
            next()
        }
    })
}

module.exports.adminInfoValidater = adminInfoValidater