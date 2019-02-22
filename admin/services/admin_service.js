const db                 =         require('../../database/mysqconection')
const auth               =         require('../../admin/validations/authorization/admin_authorization')
const config             =         require('../../properties/constant')
const email              =         require('../../config/test')
const Promise            =         require('bluebird')
const datetime           =         require('node-datetime')


//insert_admin_data_into_database
exports.insertAdminDetails = function () {

    return new Promise(function (resolve, reject) {

        Promise.coroutine(function* () {
            let hashOfAdmin1 = yield auth.createAdminHash(email.emailCredentials[0].firstAdminpswd);
            let hashOfAdmin2 = yield auth.createAdminHash(email.emailCredentials[0].secondAdminPswd);


            let current = datetime.create();
            let format1 = current.format('Y-m-d H:M:S');

            db.connection.query("INSERT INTO admin(admin_id,email,password,created_at) VALUES(?,?,?,?)", [email.emailCredentials[0].firstAdminId,email.emailCredentials[0].firstAdminEmail, hashOfAdmin1, format1],(err, result)=> {
                if (err) {
                   
                    reject(config.responseMessages.BAD_REQUEST);
                }
                else {

                    let current = datetime.create();
                    let format2 = current.format('Y-m-d H:M:S');

                    db.connection.query("INSERT INTO admin(admin_id,email,password,created_at) VALUES(?,?,?,?)", [email.emailCredentials[0].secondAdminId,email.emailCredentials[0].secondAdminEmail, hashOfAdmin2, format2],(err, result)=> {
                        if (err) {
                            reject(config.responseMessages.BAD_REQUEST);
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
                reject(config.responseMessages.BAD_REQUEST)
            }
            else {

                resolve(data)
            }
        })


    })

}
module.exports.checkAdminEmail = (req, res, next) => {

    return new Promise((resolve, reject)=>{

        db.connection.query("SELECT password FROM admin WHERE email=?", [req.body.email], function (err, result) {

            if (err) {
                reject(err)
            }

            else {
                if(result==undefined)
                {
                    reject(false)
                }
                else{
                resolve(result[0].password)
                }
            }
        })
    })

}

/**
 * get_admin_detail
 */

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
        if(req.params.status==0)
        {
            db.connection.query("SELECT booking_id,user_id,source_lat,source_lng,destination_lat,destination_lng,created_at,status FROM booking WHERE status=?",[req.params.status],(err,result)=>
            {
                if (err) {
                    reject(config.responseMessages.NO_DATA_FOUND)
                }
                else {
                    if(result[0]==undefined)
                    { 
                        reject(config.responseMessages.NO_DATA_FOUND)
                    }
                    resolve(result[0])
                }
            })
        }
        else{
            db.connection.query("SELECT booking_id,user_id,booking.driver_id,source_lat,source_lng,destination_lat,destination_lng,booking.status,booking.created_at,completed_at FROM booking INNER JOIN driver ON booking.driver_id=driver.driver_id where booking.status=?",[req.params.status], (err, data) => {
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
        }
       
    })
}
module.exports.checkDriver = () => {
    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT driver_id from driver where status=? LIMIT 1", [0], (err, data) => {
             if(err)
             {
                 reject(config.responseMessages.BAD_REQUEST)
             }
             else{
                 
            if (data[0] == undefined) {

                reject("NO DRIVER IS FREE")
            }
            else {

                db.connection.query("UPDATE booking SET driver_id=?,status=? where status=? LIMIT 1", [data[0].driver_id, 1, 0], (err, data1) => {
                    if (err) {

                        reject(config.responseMessages.BAD_REQUEST)
                    }
                    else {
                        resolve(data[0].driver_id);
                    }
                })
            }

        }
        })
    

    })
    
}
module.exports.updateDriverStatus = (data) => {
    return new Promise(function (resolve, reject) {
        console.log(data)
        db.connection.query("UPDATE driver SET status=? WHERE driver_id=?", [1, data], (err, result) => {
            if (err) {
                
                reject(config.responseMessages.DRIVER_STATUS_NOT_UPDATED)
            }
            else {
                resolve(true)

            }

        })

    })
}
/**
 * show_ongoing_booking_detail
 */
module.exports.showBookingDetails = (req, res) => {
    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT booking.driver_id, driver.vehicle_no, user_id, booking_id,source_lat,source_lng,destination_lat,destination_lng FROM booking INNER JOIN driver ON driver.driver_id=booking.driver_id  AND booking.status=? WHERE booking.driver_id=?", [1, req.result], (err, result) => {
            if (err) {
                reject(config.responseMessages.BAD_REQUEST)
            }
            else {
                if (result[0] == undefined) {
                    reject(config.responseMessages.NO_DATA_FOUND)
                }
                else {
                    resolve(result[0])
                }

            }

        })
    })
}
/**
 * checking_pending_booking
 */
module.exports.checkbooking=()=>
{
    return new Promise((resolve,reject)=>
    {
        db.connection.query("SELECT booking_id from booking WHERE status=? LIMIT 1",[0],(err,result)=>
        {
         if(err)
         {
             reject(config.responseMessages.NO_DATA_FOUND)
         }
         else{
             if(result[0]==undefined)
             {
                 reject(config.responseMessages.NO_PENDING_BOOKING)
             }
             else{
                 resolve(true)
             }
         }

        })
    })
}