const db              =            require('../../database/mysqconection')
const Promise         =            require("bluebird")
const mongoLogs       =            require('../../database/mongocon')
const datetime        =            require('node-datetime')
//insert driver data
module.exports.InsertDriverData = (req, res) => {
    return new Promise(function (resolve, reject) {
        let current = datetime.create();
        let format = current.format('Y-m-d H:M:S');

        db.connection.query("INSERT INTO driver(first_name,last_name,email,password,phone_no,vehicle_no,created_at) VALUES (?,?,?,?,?,?,?)", [req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.phone_no, req.body.vehicle_no, format], (err, result) => {
            if (err) {

                reject(false)
            }
            else {
                resolve(true)
            }


        });

    }
    )
}
//show driver data
module.exports.showDriverDetails = (data) => {

    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT driver_id,first_name,last_name,phone_no,created_at,email FROM driver WHERE email=?", [data.email], function (err, result) {
            if (err) {

                reject(false)
            }

            else {
                if (result[0] == undefined) {
                    reject(false)

                }
                else {
                    resolve(result[0])
                }

            }


        })
    })
}


//check driver email
module.exports.checkmail = (req, res, next) => {

    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT email FROM driver WHERE email=?", [req.body.email], function (err, result) {
            if (err) {

                reject(false)
            }

            else {
                if (result[0] == undefined) {
                    resolve(false)

                }
                else {
                    reject(true)
                }

            }


        })
    })
}



//get driver password
module.exports.check = (req, res, next) => {

    return new Promise(function (resolve) {

        db.connection.query("SELECT password FROM driver WHERE email=?", [req.body.email], function (err, result) {

            if (err) {
                reject(err)
            }

            else {

                resolve(result[0].password)
            }
        })
    })

}
//show all bookings of driver  
module.exports.showBookings = (req, res) => {
    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT booking_id,user_id,booking.booking_id,source_lat,source_lng,destination_lat,destination_lng, FROM booking WHERE driver_id=(SELECT driver_id from driver WHERE email=?)", [req.email], (err, result) => {
            if (err) {
                reject("ERRROR IN FETCHING BOOKING")
            }


            if (result == undefined) {
                reject("THERE IS NO BOOKING RIGHT NOW")
            }
            else {
                resolve(result)
            }


        })

    })
}
//get on goingbooking
module.exports.fetchOngoingBooking = (req, res) => {
    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT driver_id FROM driver WHERE email=?", [req.email], (err, result) => {
            if (err) {
                reject(err)
            }
            else {

                if (result[0].driver_id == undefined) {
                    reject("NO DRIVER FOUND")
                }
                else {
                    let current = datetime.create();
                    let format = current.format('Y-m-d H:M:S');
                    req.driver_id = result[0].driver_id
                    req.completed_datetime = format
                    Promise.coroutine(function* () {
                        let bookingId = yield getBookingId(req)
                        if (bookingId) {
                            db.connection.query("UPDATE booking SET status=?,completed_at=? WHERE status=? AND driver_id=?", [2, format, 1, result[0].driver_id], (err, data) => {
                                if (err) {
                                    reject("data not updated")
                                }
                                else {
                                    resolve(true)

                                }
                            })
                        }
                    })().catch((err) => {
                        reject(err)
                    })
                }
            }
        })
    })
}
//chamge busy driver to free
function getBookingId(req) {
    return new Promise(function (resolve, reject) {

        db.connection.query("select booking_id from booking where driver_id=? ", [req.driver_id], (err, result2) => {
            if (err) {
                reject(false);
            }
            else {
                req.booking_id = result2[0].booking_id;
                resolve(true)
            }
        })
    })
}

module.exports.freeDriver = (req) => {

    return new Promise(function (resolve, reject) {

        db.connection.query("UPDATE driver Set status=? WHERE driver_id=?", [0, req.driver_id], (err, result2) => {
            if (err) {
                reject("donot free the driver");
            }
            else {
                resolve(true)
            }
        })
    })

}