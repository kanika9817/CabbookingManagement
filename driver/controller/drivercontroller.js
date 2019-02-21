const service        =      require('../service/driverservice')
const mongocon       =      require('../../logs/mongologs')
const response       =      require('../../properties/constant')
const Promise        =      require('bluebird')

//driver sinup
module.exports.signup = (req, res, next) => {
    Promise.coroutine(function* () {
        let driverData = yield service.InsertDriverData(req, res)

        res.json(
            {
                status: response.responseFlags.DRIVER_INSERTED_SUCCESSFULLY,
                message: response.responseMessages.DRIVER_INSERTED_SUCCESSFULLY,
                data: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    phone_no: req.body.phone_no,
                    email: req.body.email,
                    vehicle_no: req.body.vehicle_no,


                }
            }
        )


    })().catch((err) => {
        res.json({
            status: response.responseFlags.BAD_REQUEST,
            message: responseMessages.BAD_REQUEST
        })
    })



}
//get driver detail
module.exports.driverDetails = (req, res, next) => {
    console.log(req.body)
    Promise.coroutine(function* () {
        let driverDetail = yield service.showDriverDetails(req.body)
        if (driverDetail) {
            res.json({

                status: response.responseFlags.LOGIN_SUCCESSFULLY,
                message: response.responseMessages.SUCCESSFULLY_LOGGED_IN,
                data: {
                    first_name: driverDetail.first_name,
                    last_name: driverDetail.last_name,
                    phone_no: driverDetail.phone_no,
                    email: driverDetail.email,
                    vehicle_no: driverDetail.vehicle_no,
                    token: req.body.token


                }
            })
        }
        else {
            res.json({
                status: response.responseFlags.NO_DATA_FOUND,
                message: response.responseMessages.NO_DATA_FOUND
            })
        }

    })()
}
//check driver email
module.exports.checkDriverEmail = (req, res, next) => {
    service.checkmail(req, res, next)
        .then(function (result) {

            if (result) {
                res.json({
                    status: response.responseFlags.ALREADY_EXISTS,
                    message: response.responseMessages.EMAIL_ALREADY_EXISTS
                })
            }
            else {
                next()
            }
        })
}
//show all bookings of driver
module.exports.showAllBooking = (req, res) => {
    Promise.coroutine(function* () {
        let resultOfBooking = yield service.showBookings(req, res)

        if (resultOfBooking) {
            res.json(
                {
                    status: response.responseFlags.ACTION_COMPLETE,
                    message: response.responseMessages.DISPLAY_BOOKING_DETAILS,
                    data: resultOfBooking
                }
            )
        }


    })().catch((err) => {
        res.json({
            status: response.responseFlags.BAD_REQUEST,
            message: response.responseMessages.BAD_REQUEST
        })
    })


}
//check ongoing booking
module.exports.driverOngoingDetails = (req, res, next) => {

    Promise.coroutine(function* () {
        let result = yield service.fetchOngoingBooking(req, res)
        if (result) {
            next()
        }
    })().catch((err) => {
        res.json({
            status: response.responseFlags.BAD_REQUEST,
            message: err
        })
    })
}
//log driver details to mongodb
module.exports.logDetails = (req, res, next) => {
    Promise.coroutine(function* () {
        let logCompleteStatus = yield mongocon.driverCompletedDetail(req)

        if (logCompleteStatus) {
            next()
        }

    })().catch((err) => {
        res.json({
            status: 400,
            message: err
        })
    })
}
//change driver status to free
module.exports.makeDriverFree = (req, res) => {
    Promise.coroutine(function* () {
        let freeDriverStatus = yield service.freeDriver(req)
        if (freeDriverStatus) {
            res.json({
                status: 200,
                message: "DRIVER FREE"
            })
        }

    })().catch((err) => {
        res.json({
            status: 400,
            message: response.responseMessages.NO_FREE_DRIVER
        })
    })
}