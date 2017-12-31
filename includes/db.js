var Type = require("type-of-is")
var mysql = require("mysql")
var util = require("./util")
var settings = require("./settings")

var db = mysql.createConnection({
    host: settings.db.host,
    user: settings.db.user,
    password: settings.db.password,
    database: settings.db.database
})
db.connect()
// var pool = mysql.createPool({
//     host: settings.db.host,
//     user: settings.db.user,
//     password: settings.db.password,
//     database: settings.db.database,
//     connectionLimit: 50
// })

var QUERY_CACHE_TIMEOUT = 5 * 1000 //in milliseconds
var cachedQueries = {}

function get(table, id, cols) {
    if (!Type.is(table, String)) {
        return Promise.reject("Table name must be a string!")
    }
    idClean = util.getID(id)
    if (!idClean) {
        return Promise.reject(table + " ID must be a positive integer! '" + id + "' was given!")
    }
    if (!Type.is(cols, Array)) {
        cols = ["`" + table + "`.*"]
    }

    var sql = "SELECT " + cols.join(",") + " FROM `" + table + "` WHERE id=?"

    if (sql in cachedQueries) {
        var now = new Date()
        var cacheDate = cachedQueries[sql].date
        if ((now - cacheDate) >= QUERY_CACHE_TIMEOUT) {
            delete cachedQueries[sql]
        } else {
            console.log("CACHED: " + sql)
            return Promise.resolve(cachedQueries[sql].results[0])
        }
    }

    console.log("        " + sql)
    return new Promise((resolve, reject) => {
        // pool.getConnection((err, db) => {
        //     if (err) {
        //         return reject(err)
        //     }
        db.query(sql, [idClean], (error, results, fields) => {
            // db.release()
            if (error) {
                return reject(error)
            }
            if (Type.is(results, Array) && results.length == 0) {
                return reject(table + " '" + idClean + "' does not exist!")
            }
            cachedQueries[sql] = { "date": new Date(), "results": results }
            return resolve(results[0])
        })
        // })
    })
}

function getMany(table, cols, wheres, values, joins, cmp, tail) {
    if (!Type.is(table, String)) {
        return Promise.reject("Table name must be a string!")
    }
    if (!Type.is(cols, Array)) {
        cols = ["`" + table + "`.*"]
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

    var sql = "SELECT DISTINCT " + cols.join(",") + " FROM `" + table + "` "
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

        sql += " WHERE "
        if (values.indexOf(null) < 0) {
            sql += wheres.join(wheresJoin) + wheresEnd
        } else {
            for (var i = 0; i < values.length; i++) {
                if (values[i] == null) {
                    sql += wheres[i] + " IS NULL"
                } else {
                    sql += wheres[i] + wheresEnd
                }
                if (i + 1 < values.length) {
                    sql += " " + cmp + " "
                }
            }

            var index = values.indexOf(null)
            while (index >= 0) {
                values.splice(index, 1)
                index = values.indexOf(null)
            }
        }
    }
    sql += tail + " ORDER BY `" + table + "`.id ASC"

    if (sql in cachedQueries) {
        var now = new Date()
        var cacheDate = cachedQueries[sql].date
        if ((now - cacheDate) >= QUERY_CACHE_TIMEOUT) {
            delete cachedQueries[sql]
        } else {
            console.log("CACHED: " + sql)
            return Promise.resolve(cachedQueries[sql].results)
        }
    }
    console.log("        " + sql)
    return new Promise((resolve, reject) => {
        //console.log(sql)
        // pool.getConnection((err, db) => {
        //     if (err) {
        //         return reject(err)
        //     }
        db.query(sql, values, (error, results, fields) => {
            // db.release()
            if (error) {
                return reject(error)
            }
            cachedQueries[sql] = { "date": new Date(), "results": results }
            resolve(results)
        })
        // })
    })
}

module.exports = {
    db: db,
    get: get,
    getMany: getMany
}
