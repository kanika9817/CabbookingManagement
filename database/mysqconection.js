
const sql         =   require("mysql");
const config      =require('../config/test')

//database connection
const connection = sql.createConnection(config.databaseSettings[0])
connection.connect(function (err) {
    if (err) {
        console.log("ERROR WHILE CONNECTING")
         } else {
        
        console.log('you are connected')
    }
});




    module.exports.connection = connection
   