const joi    =         require('joi');

//validation schema
const userValidater = (req, res, next) => {

    const emp = joi.object().keys({
        first_name: joi.string().required(),
        last_name: joi.string().required(),
        phone_no: joi.string().regex(/[0-9]{10}/).required(),
        email: joi.string().email().required(),
        password: joi.string().min(5).max(10).required(),
        confirm_password: joi.any().valid(joi.ref('password')).required(),
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
//validation email and pswd schema
const Valid = (req, res, next) => {
    console.log("validater")
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
const bookingValidator = (req, res, next) => {

    const emp = joi.object().keys({
        source_lat: joi.number().precision(8).required(),
        source_long: joi.number().precision(8).required(),
        destination_lat: joi.number().precision(8).required(),
        destination_long: joi.number().precision(8).required()
    })

    joi.validate(req.body, emp, (err, result) => {
        if (err) {
            res.json(
                {
                    status: 400,
                    message: 'Invalid Information',
                    data: err.details[0].message.replace(/["]/ig, '')
                }
            )

        }
        else {
            next()
        }
    })
}


module.exports.userValidater = userValidater;
module.exports.bookingValidator = bookingValidator
module.exports.Valid = Valid