const jwt = require('jsonwebtoken')
const authorModel = require("../models/authorModel")

const validate = require("../validators/validate")
const isValidName = validate.isValidName
const isEnum = validate.isEnum
const isValidEmail = validate.isValidEmail
const isValidPassword = validate.isValidPassword


// ----------------------------------------------------- create Author ----------------------------------------------------

const createAuthor = async function (req, res) {
    try {
        const data = req.body
        const { fname, lname, title, email, password } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is mandatory" })

        if (!fname) return res.status(400).send({ status: false, msg: "First Name is mandatory" })
        if (!isValidName(fname)) return res.status(400).send({ status: false, msg: "Invalid First Name, available characters ( A-Z, a-z ) with minimum 2 characters" })


        if (!lname) return res.status(400).send({ status: false, msg: "Last Name is mandatory" })
        if (!isValidName(lname)) return res.status(400).send({ status: false, msg: "Invalid Last Name, available characters ( A-Z, a-z ) with minimum 2 characters" })


        if (!title) return res.status(400).send({ status: false, msg: "Title is mandatory" })
        if (!isEnum(title)) return res.status(400).send({ status: false, msg: 'Invalid Title ,available tiltes ( Mr, Mrs, Miss)' })


        if (!email) return res.status(400).send({ status: false, msg: "Email is mandatory" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: "Invalid Email..  ex. ( abc12@gmail.com ) " })

        const emailExist = await authorModel.findOne({ email: email })
        if (emailExist) return res.status(409).send({ status: false, msg: `${email.trim()} email already exists` })


        if (!password) return res.status(400).send({ status: false, msg: "Password is mandatory" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, msg: "Minimum 8 characters are required, including ( a-z, A-Z, 0-9, special character- !@#$%^&* )" })


        const authorData = await authorModel.create(data)
        return res.status(201).send({ status: true, data: authorData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


//  --------------------------------------------------------- login ----------------------------------------------------------


const login = async function (req, res) {
    try {
        const requestBody = req.body; // it consist email and password

        if (!requestBody.email || !requestBody.password) { return res.status(400).send({ status: false, msg: "Credentials missing" }) }

        const author = await authorModel.findOne(requestBody)
        if (!author) return res.status(400).send({ status: false, msg: "Invalid Credentials!!" })

        let token = jwt.sign({
            authorId: author._id.toString(),
            topic: "bloggingWebsite"
        }, 'project-1-group-59');
        res.header('x-api-key', token)
        res.status(200).send({ status: true, msg: "Author logged in successfully", data: token })
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}



module.exports = { createAuthor, login }
