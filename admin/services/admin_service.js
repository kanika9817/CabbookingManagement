const db                 =         require('../../database/mysqconection')
const auth               =         require('../../admin/validations/authorization/admin_authorization')
const config             =         require('../../config/test')
const Promise            =         require('bluebird')
const datetime           =         require('node-datetime')


exports.insertAdminDetails = function () {

    return new Promise(function (resolve, reject) {

        Promise.coroutine(function* () {
            let hashOfAdmin1 = yield auth.createAdminHash("ynr@123");
            let hashOfAdmin2 = yield auth.createAdminHash("kanikyt454");


            let current = datetime.create();
            let format1 = current.format('Y-m-d H:M:S');

            db.connection.query("INSERT INTO admin(admin_id,email,password,created_at) VALUES(?,?,?,?)", [105, "admin1@gmail.com", hashOfAdmin1, format1], function (err, result) {
                if (err) {
                    console.log(err)
                    reject(config.errorCode[2]);
                }
                else {

                    let current = datetime.create();
                    let format2 = current.format('Y-m-d H:M:S');

                    db.connection.query("INSERT INTO admin(admin_id,email,password,created_at) VALUES(?,?,?,?)", [112, "admin2@gmail.com", hashOfAdmin2, format2], function (err, result) {
                        if (err) {
                            reject(config.errorCode[2]);
                        }
                        else {
                            resolve("Both admins are inserted Successfully");
                        }
                    })
                }
            })
        })();
    })
}



module.exports.checkData = () => {
    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT * FROM admin LIMIT 1 ", (err, data) => {
            if (err) {
                reject(err)
            }
            else {

                resolve(data)
            }
        })


    })

}
module.exports.checkAdminEmail = (req, res, next) => {

    return new Promise(function (resolve, reject) {

        db.connection.query("SELECT password FROM admin WHERE email=?", [req.body.email], function (err, result) {

            if (err) {
                reject(err)
            }

            else {
                if(result[0].password==undefined)
                {
                    reject("Admin Donot Exists")
                }
                else{
                resolve(result[0].password)
                }
            }
        })
    })

}




module.exports.showAdminData = (req, res, next) => {


    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT email FROM admin WHERE email=?", [req.body.email], (err, result) => {
            if (err) {
               reject(err)

            }
            else {

                if (result[0] == undefined) {
                    reject("NO DATA FOUND")
                }
                else {
                    resolve(result[0])
                }
            }


        });
    })
}
module.exports.getBookingDetails = (req) => {
    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT booking_id,user_id,booking.driver_id,source_lat,source_lng,destination_lat,destination_lng,booking.status,booking.created_at,completed_at FROM booking INNER JOIN driver ON booking.driver_id=driver.driver_id WHERE booking.status=?", [req.params.status], (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                if(data==undefined)
                {
                    reject()
                }
                resolve(data)
            }
        })
    })
}
module.exports.checkDriver = () => {
    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT driver_id from driver where status=? LIMIT 1", [0], (err, data) => {

            if (data[0].driver_id == undefined) {

                reject("NO DRIVER IS FREE")
            }
            else {

                db.connection.query("UPDATE booking SET driver_id=?,status=? where status=? LIMIT 1", [data[0].driver_id, 1, 0], (err, data1) => {
                    if (err) {

                        reject("dono update successfully")
                    }
                    else {
                        resolve(true);
                    }
                })
            }


        })


    })

}
module.exports.updateDriverStatus = (data) => {
    return new Promise(function (resolve, reject) {
        db.connection.query("UPDATE driver SET status=? WHERE driver_id=?", [1, data], (err, result) => {
            if (err) {
                reject("NOT UPDATED")
            }
            else {
                resolve(true)

            }

        })

    })
}

module.exports.showBookingDetails = (req, res) => {
    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT booking.driver_id, driver.vehicle_no, user_id, booking_id,source_lat,source_lng,destination_lat,destination_lng FROM booking INNER JOIN driver ON driver.driver_id=booking.driver_id  AND booking.status=? WHERE booking.driver_id=?", [1, req.result], (err, result) => {
            if (err) {
                res.send(config.errorCode[0])
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