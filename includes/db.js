var Type = require("type-of-is")
var mysql = require("mysql")
var util = require("./util")
var settings = require("./settings")

var QUERY_CACHE_TIMEOUT = 5 * 1000 //in milliseconds
var cachedQueries = {}

var db = mysql.createConnection({
    host: settings.db.host,
    user: settings.db.user,
    password: settings.db.password,
    database: settings.db.database
})
db.connect()

/**
 * Heartbeat so the MySQL connection won't get closed
 */
setInterval(() => {
    db.ping((err) => {
        if (err) {
            console.log("ping failed! " + err)
        }
    })
}, 60000)

// var pool = mysql.createPool({
//     host: settings.db.host,
//     user: settings.db.user,
//     password: settings.db.password,
//     database: settings.db.database,
//     connectionLimit: 50
// })

/**
 * Clear cached queries every-so-often so it doesn't get too big
 */
setInterval(() => {
    var now = new Date()
    var cleared = 0
    for (var sql in cachedQueries) {
        var cacheDate = cachedQueries[sql].date
        if ((now - cacheDate) >= QUERY_CACHE_TIMEOUT) {
            delete cachedQueries[sql]
            cleared++
        }
    }

    if (cleared > 0) {
        console.log("CACHE: Cleared " + cleared + " cached queries!")
    }
}, 2 * QUERY_CACHE_TIMEOUT)

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
    var sqlKey = sql + " " + id
    if (sqlKey in cachedQueries) {
        console.log("CACHED: " + sqlKey)
        return Promise.resolve(Object.assign({}, cachedQueries[sqlKey].results[0]))
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
            cachedQueries[sqlKey] = { "date": new Date(), "results": results }
            return resolve(results[0])
        })
        // })
    })
}

function getMany(table, cols, wheres, values, joins, cmp, tail, order) {
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
    if (!order) {
        order = " ORDER BY `" + table + "`.id ASC"
    }

    var sql = "SELECT DISTINCT " + cols.join(",") + " FROM `" + table + "` "
    if (joins.length > 0) {
        sql += joins.join(" ")
    }
    if (wheres.length > 0) {
        wheresCmp = {
            "AND": ["=? AND ", "=?"],
            "OR": ["=? OR ", "=?"],
            "SEARCH": [" LIKE ? OR ", " LIKE ?"],
            "<": ["<? AND ", "<?"],
            "<=": ["<=? AND ", "<=?"],
            ">": [">? AND ", ">?"],
            ">=": [">=? AND ", ">=?"]
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
    sql += tail + " " + order

    var sqlKey = sql + " " + values.join(",")
    if (sqlKey in cachedQueries) {
        console.log("CACHED: " + sqlKey)
        return Promise.resolve(Object.assign([], cachedQueries[sqlKey].results))
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
            cachedQueries[sqlKey] = { "date": new Date(), "results": results }
            resolve(results)
        })
        // })
    })
}

function insert(table, cols, values) {
    return new Promise((resolve, reject) => {
        if (!Type.is(table, String)) {
            return reject("Table name must be a string!")
        }
        if (!Type.is(cols, Array)) {
            cols = []
        }
        if (!Type.is(values, Array)) {
            return reject("Must provide at least one value to insert into table '" + table + "'!")
        }
        if (cols.length > 0 && cols.length != values.length) {
            return reject("The number of columns and values do not match!")
        }

        var sql = "INSERT INTO `" + table + "` "
        if (cols.length > 0) {
            sql += "(`" + cols.join("`,`") + "`) "
        }

        sql += "VALUES (" + Array(values.length).fill("?").join(",") + ")"
        console.log(sql)
        db.query(sql, values, (error, results, fields) => {
            if (error) {
                return reject(error)
            }
            resolve(results.insertId)
        })
    })
}

module.exports = {
    db: db,
    get: get,
    getMany: getMany
}
