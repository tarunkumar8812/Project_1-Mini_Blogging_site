
// ---------------------------------------------- this is for author validation ------------------------------------------------
function isValidName(value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    var isValid = /^([a-zA-Z]){2,15}$/
    return isValid.test(value.trim());
}

function isEnum(value) {
    if (typeof value !== "string") { return false }
    else {
        let titles = ["Mr", "Mrs", "Miss"]
        for (let i = 0; i < titles.length; i++) {
            if (titles[i] == value.trim()) { return true }
        }
        return false
    }
}

function isValidEmail(value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    else {
        var isValid = /[a-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/;
        // console.log(value.trim());
        return isValid.test(value.trim());
    }
}

function isValidPassword(value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    else {
        let isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        return isValid.test(value);
    }
}

// ---------------------------------------------- this is for blogs validation ------------------------------------------------

const isValid = function (value) { //function to check entered data is valid or not
    if (typeof value == "string") {
        if (value.trim() === "") {
            return false
        } else { return value.trim() }
    } else { return false }
}

const isValidForArray = function (value) {      //function to check entered data in array is valid or not
    if (typeof value == "string") { return isValid(value) }
    const newArr = []
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {    //example :-   ["ghfgh","   ",56444,"freendon 1947,"ghhgf"]
            if (typeof (value[i]) == "string") {
                if (value[i].trim() !== "") {
                    newArr.push(value[i].trim())
                } else { return false }
            }
            else { return false }
        }
        return newArr
    }
    else { return false }
}

function Boolean(value) {
    if (value == true || value == false) { return true }
    return false
}




module.exports = { isValidName, isEnum, isValidEmail, isValidPassword, isValid, isValidForArray, Boolean }
