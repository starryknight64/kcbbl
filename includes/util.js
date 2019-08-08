var Type = require("type-of-is")

function toTitleCase(text) {
    return text.replace(/\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        })
}

function toPlural(text) {
    if (text.endsWith("y")) {
        return text.substring(0, text.length - 1) + "ies"
    } else if (text.endsWith("h")) {
        return text + "es"
    } else {
        return text + "s"
    }
}

function formatNumberWithCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

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

function handleRESTError(res, error) {
    err = {}
    if (Type.is(error, Error)) {
        err.error = error.message
        err.stacktrace = error.stack.split("\n")
    } else if (Type.is(error, String)) {
        err.error = error
    } else {
        err = error
    }
    res.status(400).json(err)
}

function handleError(res, error) {

}

module.exports = {
    toTitleCase: toTitleCase,
    toPlural: toPlural,
    formatNumberWithCommas: formatNumberWithCommas,
    getID: getID,
    handleRESTError: handleRESTError
}
