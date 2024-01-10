const knex = require('knex')

const db = knex({
    client: "mysql2",
    connection: {
        host: "192.168.10.167",
        port: 3306,
        user: "patrick",
        password: "abc@123",
        database: "programas_ti"
    }
})

module.exports = db
