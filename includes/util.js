var Type = require("type-of-is")

function getID(num) {
    if (!Type.is(num, Number)) {
        if (Type.is(num, String)) {
            if (num.includes(".") || num.toLowerCase().includes("x")) {
                return NaN
            }
            number = Number(num)
            if (isNaN(number) || number <= 0) {
                return NaN
            }
            return number
        } else {
            return NaN
        }
    } else if (num <= 0) {
        return NaN
    }
    return num
}

function handleError(res, error) {
    err = {}
    if (Type.is(error, Error)) {
        err.error = error.message
        err.stacktrace = error.stack.split("\n")
    } else if (Type.is(error, String)) {
        err.error = error
    } else {
        err = error
    }
    res.status(400).send(err)
}

module.exports = {
    getID: getID,
    handleError: handleError
}
