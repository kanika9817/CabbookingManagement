//mongologs.js
const mongo       =    require('../database/mongocon')
const Promise     =    require('bluebird')

//insert driverAssign detail to mongo
module.exports.addDetail=(data,admin_email,date_time)=>
{ 
   return new Promise(function(resolve,reject){
   let record={
   driver_id:data.driver_id,
   booking_id:data.booking_id,
   adminEmail:admin_email,
   driver_assigned_time:date_time
}
mongo.dbo.collection("assignedDetails").insertOne(record,function(err, result)
{if(err)
    {
    reject(false)
    }
    else
    {
    resolve(true)
    }
})
})

}

//insert bookingComplete Detail to mongo
module.exports.driverCompletedDetail=(req)=>
{ 
return new Promise(function(resolve,reject){

    let record={
driver_id:req.driver_id,
booking_id:req.booking_id,
booking_completed_time:req.completed_datetime
}
mongo.dbo.collection("completeDetail").insertOne(record,function(err, result)
{if(err)
    {
    reject(false)
    }
    else
    {
    resolve(true)
    }
})
})

}