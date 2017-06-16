var mysql = require("mysql")
var util = require("./util")

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bloodbowl"
})
db.connect()

function get(table, id, cols) {
    if (!Type.is(table, String)) {
        return Promise.reject("Table name must be a string!")
    }
    id = util.getID(id)
    if (!id) {
        return Promise.reject(table + " ID must be a positive integer!")
    }
    if (!Type.is(cols, Array)) {
        cols = [table + ".*"]
    }

    var sql = "SELECT " + cols.join(",") + " FROM `" + table + "` WHERE id=?"
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (error, results, fields) => {
            if (error) {
                return reject(error)
            }
            if (Type.is(results, Array) && results.length == 0) {
                return reject(table + " '" + id + "' does not exist!")
            }
            return resolve(results[0])
        })
    })
}

function getMany(table, cols, wheres, values, joins) {
    if (!Type.is(table, String)) {
        return Promise.reject("Table name must be a string!")
    }
    if (!Type.is(cols, Array)) {
        cols = [table + ".*"]
    }
    if (!Type.is(wheres, Array)) {
        wheres = []
    }
    if (!Type.is(values, Array)) {
        values = []
    }
    if (wheres.length != values.length) {
        return Promise.reject("Wheres array length must match Values array length!")
    }
    if (!Type.is(joins, Array)) {
        joins = []
    }

    var sql = "SELECT DISTINCT " + cols.join(",") + " FROM `" + table + "`"
    if (joins.length > 0) {
        sql += joins.join(" ")
    }
    if (wheres.length > 0) {
        sql += " WHERE " + wheres.join("=? AND ") + "=?"
    }
    sql += " ORDER BY " + table + ".id ASC"
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results, fields) => {
            if (error) {
                return reject(error)
            }
            resolve(results)
        })
    })
}

module.exports = db
module.exports = get
module.exports = getMany
