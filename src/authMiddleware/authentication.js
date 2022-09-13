const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId //check whether the format or objectid is of 24 digit or not


// ------------------------------------------- authentication --------------------------------------------------

const authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "Token must be present" });

        jwt.verify(token, "project-1-group-59", function (err, decodedToken) {
            if (err) { return res.status(401).send({ status: false, msg: "Token is invalid" }) }
            req.decodedToken = decodedToken
            next()
        });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}


// ------------------------------------------- authriztion --------------------------------------------------

const authorisation = async function (req, res, next) {
    try {
        const p = req.params.blogId
        const body = req.body
        const b = body.authorId
        const q = req.query
        let userLoggedIn = req.decodedToken.authorId

        //----------------------this is for path params----------------------

        if (p) {
            if (!ObjectId.isValid(p.trim())) return res.status(400).send({ status: false, msg: "BlogId is not valid" })

            const userToBeModified = await blogModel.findOne({ _id: p })

            if (!userToBeModified) return res.status(404).send({ status: false, msg: "No data found" })

            if (userToBeModified.authorId.toString() !== userLoggedIn) return res.status(403).send({ status: false, msg: 'Access denied' })

            return next()

        }

        //----------------------this is for body----------------------

        if (body && Object.values(body).length > 0) {
            if (!b) { return res.status(400).send({ status: false, msg: "AuthorId is required" }) }

            if (typeof b !== "string") { return res.status(400).send({ status: false, msg: "AuthorId is not valid" }) }

            if (!ObjectId.isValid(b.trim())) return res.status(400).send({ status: false, msg: "AuthorId is not valid" })

            const userToBeModified = await authorModel.findOne({ _id: b })

            if (!userToBeModified) return res.status(400).send({ status: false, msg: "No data found" })

            if (userToBeModified._id.toString() !== userLoggedIn) return res.status(403).send({ status: false, msg: 'Access denied' })
            next()
        }

        //----------------------this is for query params----------------------

        else {
            const temp = {}

            if (q.category && q.category.trim() !== "") { temp.category = q.category.trim() }

            if (q.authorId && q.authorId.trim() !== "") {
                if (!ObjectId.isValid(q.authorId.trim())) return res.status(400).send({ status: false, msg: "AuthorId is not valid" })
                temp.authorId = q.authorId.trim()
            }

            if (q.tags && q.tags.trim() !== "") { temp.tags = q.tags.trim() }

            if (q.subcategory && q.subcategory.trim() !== "") { temp.subcategory = q.subcategory.trim() }

            if (q.ispublished && q.ispublished.trim() !== "") {
                if (q.ispublished.trim() == "true") { temp.isPublished = true }
                if (q.ispublished.trim() == "false") { temp.isPublished = false }
                else { return res.status(400).send({ status: false, msg: "Value of ispublished can be true or false only" }) }
            }
            if (Object.values(temp) == 0) return res.status(400).send({ status: false, msg: "please apply filter" })

            const userToBeModified = await blogModel.findOne(temp)

            if (!userToBeModified) return res.status(404).send({ status: false, msg: 'No data found' })

            if (userToBeModified.authorId.toString() !== userLoggedIn) return res.status(403).send({ status: false, msg: 'Access denied' })
            req.savedTemp = temp
            next()
        }

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports = { authenticate, authorisation }