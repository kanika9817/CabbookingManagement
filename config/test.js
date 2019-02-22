module.exports = {

  PORT: 9653,
  databaseSettings: [
    {
      host: 'localhost',
      user: "root",
      password: "",
      database: "uber"
    }

  ],
  mongoDbSettings: [{
    url: "mongodb://localhost:27017/",
    dbName: "uber"
  }],

  toknKeys: [{
    adminKey: "wafer@124",
    driverKey: "qwerty@987",
    customerKey: "yater@565"

  }],
  emailCredentials: [
    {
      firstAdminId: 105,
      firstAdminEmail: "admin1@gmail.com",
      firstAdminpswd: "rama@45",
      secondAdminId: 112,
      secondAdminEmail: "admin2@gmail.com",
      secondAdminPswd: "utyer@876",
    }
  ]

}