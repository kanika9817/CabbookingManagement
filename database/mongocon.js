const MongoClient = require('mongodb').MongoClient;
const config=require('../config/test')

//mongodb connection
MongoClient.connect(config.mongoDbSettings[0].url, { useNewUrlParser: true },function(err, db) {
    if (err) throw err;
    console.log("MONGO Database created!");
    var dbo = db.db(config.mongoDbSettings[0].dbName);
   
    module.exports.dbo=dbo;
  
  });

 