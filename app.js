
                       /*     app.js     */
const express              =           require('express');
const app                  =           express();
const config               =           require('./config/test')
const customer             =           require('./customer/customer')
const driver               =           require('./driver/driver')
const admin                =           require('./admin/admin')
const adminservice         =           require('./admin/services/admin_service')
const startUpService       =           require('./utility/startUpServices')
const bodyParser           =           require("body-parser");
const swaggerUi            =           require('swagger-ui-express')
const swaggerDocument      =           require('./swager.json');
const Promise              =           require('bluebird')



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//app routes
app.use('/admin',admin)
app.use('/customer', customer)
app.use('/driver',driver)




//listening to the port
app.listen(config.PORT,(err, result)=> {
    if (err) {
        console.log("ERROR OCCURED")
    }
    else {
        startUpService.addAdminData()
    }
})