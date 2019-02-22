const bcrpyt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltrounds = 10
const service = require('../../service/userservice')
const config = require('../../../config/test')
const response = require('../../../properties/constant')


//func to create_hash
module.exports.createPswdHash = (req, res, next) => {

    bcrpyt.hash(req.body.password, saltrounds).then(function (hash) {
        req.body.password = hash;
        next();
    });


}
//check user exist to get pswd
async function checkUser(req, res, next) {

    let data = await service.check(req, res)
    const match = await bcrpyt.compare(req.body.password, data);

    if (match) {
        next()
    }
    else {
        res.json({
            status: response.responseFlags.INVALID_PASSWORD,
            message: response.responseMessages.INVALID_PASSWORD

        })
    }
}

/**
 * genrate_customer_token
 */
module.exports.genrateToken = (req, res, next) => {
    jwt.sign({ email: req.body.email }, config.toknKeys[0].customerKey, (err, token) => {
        if (err) {
            res.json({
                status: response.responseFlags.BAD_REQUEST,
                message: response.responseMessages.BAD_REQUEST
            })
        }
        else {
            req.body.token = token
            next()
        }
    })


}

//func to verfiy token
module.exports.verifytokn = (req, res, next) => {

    jwt.verify(req.params.token, config.toknKeys[0].customerKey, function (err, decoded) {
        if (err) {
            res.json({
                status: response.responseFlags.INVALID_TOKEN,
                message: response.responseMessages.INVALID_TOKEN
            })
        }
        else {
          req.email = decoded.email
            next()

        }
    });
}


module.exports.checkUser = checkUser

