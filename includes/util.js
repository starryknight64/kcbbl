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
