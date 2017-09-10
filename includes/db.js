var Type = require("type-of-is")
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
    idClean = util.getID(id)
    if (!idClean) {
        return Promise.reject(table + " ID must be a positive integer!")
    }
    if (!Type.is(cols, Array)) {
        cols = [table + ".*"]
    }

    var sql = "SELECT " + cols.join(",") + " FROM `" + table + "` WHERE id=?"
    return new Promise((resolve, reject) => {
        db.query(sql, [idClean], (error, results, fields) => {
            if (error) {
                return reject(error)
            }
            if (Type.is(results, Array) && results.length == 0) {
                return reject(table + " '" + idClean + "' does not exist!")
            }
            return resolve(results[0])
        })
    })
}

function getMany(table, cols, wheres, values, joins, cmp, tail) {
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
    if (!cmp) {
        cmp = "AND"
    }
    if (!tail) {
        tail = ""
    }

    var sql = "SELECT DISTINCT " + cols.join(",") + " FROM `" + table + "`"
    if (joins.length > 0) {
        sql += joins.join(" ")
    }
    if (wheres.length > 0) {
        wheresCmp = {
            "AND": ["=? AND ", "=?"],
            "OR": ["=? OR ", "=?"],
            "SEARCH": [" LIKE ? OR ", " LIKE ?"]
        }
        wheresJoin = wheresCmp[cmp][0]
        wheresEnd = wheresCmp[cmp][1]

        sql += " WHERE " + wheres.join(wheresJoin) + wheresEnd
    }
    sql += tail + " ORDER BY " + table + ".id ASC"
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results, fields) => {
            if (error) {
                return reject(error)
            }
            resolve(results)
        })
    })
}

module.exports = {
    db: db,
    get: get,
    getMany: getMany
}
