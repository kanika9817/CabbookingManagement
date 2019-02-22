
const service = require('../services/admin_service')
const mongoLogs = require('../../logs/mongologs')
const response = require('../../properties/constant')
const datetime = require('node-datetime')
const Promise = require('bluebird')

let current, format
/**
 * print_booking_of_customer
 */
module.exports.printAllBooking = (req, res) => {

    Promise.coroutine(function* () {
        let result = yield service.getBookingDetails(req)
        if (result) {
            res.json(
                {
                    status: response.responseFlags.ACTION_COMPLETE,
                    message: response.responseMessages.DISPLAY_BOOKING_DETAILS,
                    data: result
                }
            )
        }
    })().catch((err) => {
        res.json({
            status: response.responseFlags.NO_DATA_FOUND,
            message: response.responseMessages.NO_DATA_FOUND
        })
    })
}
/**
 * assign_driver_to_customer
 */
module.exports.assignDriver = (req, res, next) => {
    Promise.coroutine(function* () {
        let bookingStatus = yield service.checkbooking()
         if (bookingStatus) {
            let match = yield service.checkDriver()
            if (match) {

                let updatedStatus = yield service.updateDriverStatus(match)

                if (updatedStatus) {
                    current = datetime.create();
                    format = current.format('Y-m-d H:M:S');
                    req.format = format;
                    req.result = match
                    next()
                }

            }
        }
    })().catch((errMsg) => {
        res.json({
            status: response.responseFlags.SHOW_ERROR_MESSAGE,
            message: errMsg
        })
    })
}
/**
 * print_admin_details
 */
module.exports.printAdminDetails = (req, res, next) => {
    Promise.coroutine(function* () {
        let dataOfAdmin = yield service.showAdminData(req)
        res.json(
            {
                status: response.responseFlags.LOGIN_SUCCESSFULLY,
                message: response.responseMessages.SUCCESSFULLY_LOGGED_IN,
                data: {
                    adminId: dataOfAdmin.admin_id,
                    adminEmail: dataOfAdmin.email,
                    createdAt: dataOfAdmin.created_at,
                    token: req.body.token
                }
            })

    })().catch((err) => {
        res.json
            ({
                status: response.responseFlags.NO_DATA_FOUND,
                message: err,
            })
    })

}

/**
 * show_ongoing_booking
 */
module.exports.showDriverAssign = (req, res) => {
    Promise.coroutine(function* () {
        let resultOfDriver = yield service.showBookingDetails(req, res)
        if (resultOfDriver) {
            let logstatus = yield mongoLogs.addDetail(resultOfDriver, req.email, req.format)

            if (logstatus) {
                res.json(
                    {
                        status: response.responseFlags.DRIVER_ASSIGNED,
                        message: response.responseFlags.DRIVER_ASSIGNED,
                        data: {
                            driver_id: resultOfDriver.driver_id,
                            vehicle_no: resultOfDriver.vehicle_no,
                            booking_id: resultOfDriver.booking_id,
                            user_id: resultOfDriver.user_id,
                            source_lat: resultOfDriver.source_lat,
                            source_lng: resultOfDriver.source_lng,
                            destination_lat: resultOfDriver.destination_lat,
                            destination_lng: resultOfDriver.destination_lng,
                        }
                    }
                )
            }
        }

    })().catch((err) => {
        console.log(err)
        res.json({
            status: response.responseFlags.DRIVER_NOT_FOUND,
            message: err
        })
    }
    )
}