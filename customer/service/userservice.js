const db              =        require('../../database/mysqconection')
const datetime        =        require('node-datetime')
const config          =        require("../../config/test")


let result1;
//add customer to database
module.exports.addUserData = (req, res) => {
    return new Promise(function (resolve, reject) {
        let current = datetime.create();
        let format2 = current.format('Y-m-d H:M:S');
        db.connection.query("INSERT INTO user(first_name,last_name,phone_no,email,password,created_at) VALUES (?,?,?,?,?,?)", [req.body.first_name, req.body.last_name, req.body.phone_no, req.body.email, req.body.password, format2], function (err, result) {
            if (err) {
                reject(false)
            }
            else {
                resolve(true)
            }

        });
    })
}

//get user detail to database
module.exports.customerDetail = (req, res) => {
    return new Promise((resolve, reject) => {
        db.connection.query("SELECT first_name,last_name,phone_no,email,created_at FROM user WHERE email=?", [req.body.email], function (err, result) {
            if (err) {

                reject(err)
            }
            else {

                if (result[0] == undefined) {
                    reject(false)
                }
                else {

                    resolve(result[0])
                }

            }


        });
    })
}


//check customer email in database
module.exports.checkmail = (req, res, next) => {
    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT email FROM user WHERE email=?", [req.body.email], function (err, result) {
            if (err) {

                reject(false)
            }

            else {
               
                if (result[0] == undefined) {
                    resolve(false)
                }
                else {
                    resolve(true)
                }
            }

        })
    })
}


//get customer pswd from database
module.exports.check = (req, res, next) => {
    return new Promise(function (resolve, reject) {

        db.connection.query("SELECT password FROM user WHERE email=?", [req.body.email], function (err, result) {

            if (err) {
                reject(false)
            }

            else {
                if (result[0] == undefined) {
                    reject(false)
                }
                else {
                    resolve(result[0].password)
                }
            }
        })
    })

}


//insert_customer_booking_by_user_id
module.exports.booking = (req, res) => {

    return new Promise(function (resolve, reject) {
        db.connection.query("SELECT * FROM user WHERE email=?", [req.email], function (err, result) {
            if (err) {
                reject(false)
            }

            else {
                result1 = result[0].user_id
                let data = datetime.create();
                let format = data.format('Y-m-d H:M:S')
             db.connection.query("INSERT INTO booking(user_id,source_lat,source_lng,destination_lat,destination_lng,created_at) VALUES (?,?,?,?,?,?)", [result1, req.body.source_lat, req.body.source_long, req.body.destination_lat, req.body.destination_long, format], function (err, result) {
                    if (err) {
                        reject(false)
                    }
                    else {
                        resolve(true);
                    }


                })
            }
        })

    })
}


//get customer details
module.exports.bookingdetails = (req, res) => {
    return new Promise(function (resolve, reject) {

        db.connection.query("SELECT * FROM booking WHERE user_id=?", [result1], function (err, result) {
            if (err) {

                reject(false)
            }
            else {

                resolve(result[0])
            }


        });
    })
}
