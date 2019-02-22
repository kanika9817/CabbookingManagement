const bcrpyt = require('bcrypt')
const jwt = require('jsonwebtoken')
const service = require('../../services/admin_service')
const config = require('../../../config/test')
const response = require('../../../properties/constant')
const saltrounds = 10

/**
 * create_hash_of_admin pswd
 */

module.exports.createAdminHash = (password) => {
    return new Promise((resolve, reject) => {
        bcrpyt.hash(password, saltrounds).then(function (hash) {

            resolve(hash);
        }).catch((err) => 
        {
            reject(err)
        })

    })


}
/**
 * 
 * @param {admin_email} req 
 * @param {*password} res  
 */
async function checkAdmin(req, res, next) {

    const data = await service.checkAdminEmail(req, res)
    const match = await bcrpyt.compare(req.body.password, data);

        if (match) {
            next()
        }
        else {
            res.json({
                status: response.responseFlags.INVALID_PASSWORD,
                message: response.responseMessages.INVALID_PASSWORD,
            })
        }
    }
    
/**
 * genrate_admin_token
 */
module.exports.tokenGen = (req, res, next) => {

    jwt.sign({ email: req.body.email }, config.toknKeys[0].adminKey, (err, data) => {
        if (err) {
            res.json({
                status: response.responseFlags.BAD_REQUEST,
                message: response.responseMessages.BAD_REQUEST
            })
        }
        else {
            req.body.token = data;
            next()
        }
    })

}
/**
 * verify admin_token
 */
module.exports.verifyTokn = (req, res, next) => {

    jwt.verify(req.params.token, config.toknKeys[0].adminKey, (err, decoded) => {
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

module.exports.checkAdmin = checkAdmin