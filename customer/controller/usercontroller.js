const service = require('../service/userservice')
const config = require('../../config/test')
const response = require('../../properties/constant')
const Promise = require('bluebird')


//customer_signup
module.exports.customerSignup = (req, res) => {
    Promise.coroutine(function* () {
        let userData = yield service.addUserData(req, res)
        if (userData) {
            res.json({
                status: response.responseFlags.ACTION_COMPLETE,
                message: response.responseMessages.INSERTED_USER_SUCCESSFULLY,
                data: {
                    first_Name: req.body.first_name,
                    last_Name: req.body.last_name,
                    phone_no: req.body.phone_no,
                    email: req.body.email,
                }
            })
        }
    })().catch((err) => {
        res.json({
            status: response.responseFlags.BAD_REQUEST,
            message: response.responseMessages.DATA_INSERTION_ERROR
        })
    })

}


//print customer details
module.exports.printCustomerDetails = (req, res) => {
    Promise.coroutine(function* () {
        let resultOfCustomer = yield service.customerDetail(req, res)
        if (resultOfCustomer) {
            res.json(
                {
                    status: response.responseFlags.LOGIN_SUCCESSFULLY,
                    message: response.responseMessages.SUCCESSFULLY_LOGGED_IN,
                    data: {
                        first_Name: resultOfCustomer.first_name,
                        last_Name: resultOfCustomer.last_name,
                        phone_no: resultOfCustomer.phone_no,
                        email: resultOfCustomer.email,
                        created_at: resultOfCustomer.created_at,
                        token: req.body.token
                    }
                })
        }

    })().catch((err) => {
        res.json({
            status: response.responseFlags.NO_DATA_FOUND,
            message: response.responseMessages.NO_DATA_FOUND
        })
    })
}



//check customer email
async function checkUserEmail(req, res, next) {

    let match = await service.checkmail(req, res, next)

    if (match) {
        res.json({
            status: response.responseFlags.ALREADY_EXISTS,
            message: response.responseMessages.EMAIL_ALREADY_EXISTS
        })
    }
    else {
        next()
    }
}

//add customer booking
async function addbooking(req, res, next) {
    let data = await service.booking(req, res)
    let data1 = await service.bookingdetails(req, res)
    if (data1 == undefined) {
        res.json({
            status: response.responseFlags.NO_DATA_FOUND,
            message: response.responseMessages.NO_DATA_FOUND
        })
    }
    else {
        res.json(
            {
                status: response.responseFlags.LOGIN_SUCCESSFULLY,
                message: response.responseMessages.DISPLAY_BOOKING_DETAILS,
                data:
                {
                    Booking_Id: data1.booking_id,
                    source_latitude: data1.source_lat,
                    source_longitude: data1.source_lng,
                    destination_latitude: data1.destination_lat,
                    destination_longitude: data1.destination_lng,
                    booking_time: data1.created_at,
                    booking_status: data1.status,
                    statusmessage: "PLEASE WAIT TILL DRIVER ASSIGN TO YOU"
                }

            }
        )
    }
}


module.exports.checkUserEmail = checkUserEmail
module.exports.addbooking = addbooking