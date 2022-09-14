const mongoose = require("mongoose")
const moment = require('moment')
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const ObjectId = mongoose.Types.ObjectId //check whether the format or objectid is of 24 digit or not

const validate = require("../validators/validate")
const isValid = validate.isValid
const isValidForArray = validate.isValidForArray
const Boolean = validate.Boolean


// ----------------------------------------------------- create Blogs by body---------------------------------------------

const createBlogs = async function (req, res) {
    try {
        let blog = req.body
        let { title, body, authorId, tags, category, subcategory, deletedAt, isDeleted, isPublished, publishedAt } = blog

        if (isValid(title) == false) return res.status(400).send({ status: false, msg: "Title is required and should be string" })

        if (isValid(body) == false) return res.status(400).send({ status: false, msg: "Body is required and should be string" })

        const id = await authorModel.findById(authorId)
        if (!id) return res.status(404).send({ status: false, msg: "No data found" })

        // --------------tags are not mandatory as per question ----------------
        if (tags) { if (isValidForArray(tags) == false) return res.status(400).send({ status: false, msg: "Tag is required and should be (String or Array of String)" }) }

        if (isValidForArray(category) == false) return res.status(400).send({ status: false, msg: "Category is required and should be (String or Array of String)" })

        // --------------subcategory is not mandatory as per question ----------------
        if (subcategory) { if (isValidForArray(subcategory) == false) return res.status(400).send({ status: false, msg: "Subcategory is required and should be (String or Array of String)" }) }

        if (isDeleted) {
            if (Boolean(isDeleted) == false) return res.status(400).send({ status: false, msg: "isDeleted should be true or false" })
        }
        if (isPublished) {
            if (Boolean(isPublished) == false) return res.status(400).send({ status: false, msg: "isPublished should be true or false" })
        }

        const blogData = await blogModel.create(blog)
        return res.status(201).send({ status: true, data: blogData })
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}


// --------------------------------------------------- get Blogs by query-------------------------------------------------

const getBlogs = async function (req, res) {
    try {
        const q = req.query
        const temp = { isDeleted: false, isPublished: true }

        if (q.category && q.category.trim() !== "") { temp.category = q.category.trim() }

        if (q.authorId && q.authorId.trim() !== "") {
            if (!ObjectId.isValid(q.authorId.trim())) return res.status(400).send({ status: false, msg: "AuthorId is not valid" })
            temp.authorId = q.authorId.trim()
        }

        if (q.tags && q.tags.trim() !== "") { temp.tags = q.tags.trim() }

        if (q.subcategory && q.subcategory.trim() !== "") { temp.subcategory = q.subcategory.trim() }

        const result = await blogModel.find(temp)//.count()
        if (result.length == 0) return res.status(404).send({ status: false, msg: "No data found" })

        return res.status(200).send({ status: true, data: result })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


// ------------------------------------------------------- update Blogs by body -----------------------------------------------

const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let requestBody = req.body;

        let { title, body, tags, subcategory } = requestBody
        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, msg: "Please provide blog details to update" });

        let temp1 = {}
        let temp2 = {}

        if (title) {
            if (isValid(title) == false) return res.status(400).send({ status: false, msg: "Title should be String" })
            temp1.title = isValid(title)
        }

        if (body) {
            if (isValid(body) == false) return res.status(400).send({ status: false, msg: "Body should be String" })
            temp1.body = isValid(body)
        }

        if (tags) {
            if (isValidForArray(tags) == false) return res.status(400).send({ status: false, msg: "Tag should be (String or Array of String)" })
            temp2.tags = isValidForArray(tags)
        }

        if (subcategory) {
            if (isValidForArray(subcategory) == false) return res.status(400).send({ status: false, msg: "Subcategory should be (String or Array of String)" })
            temp2.subcategory = isValidForArray(subcategory)
        }

        const updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            {
                title: temp1.title,
                body: temp1.body,
                $addToSet: temp2,
                isPublished: true,
                publishedAt: moment()
            },
            { new: true });

        if (!updatedBlog) { return res.status(404).send({ status: false, msg: "No data found" }) }

        return res.status(200).send({ status: true, data: updatedBlog });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
};


// ----------------------------------------------------- deleteBlogs by param -------------------------------------------------

const deleteBlogsByParam = async function (req, res) {
    try {
        const blogId = req.params.blogId

        const toBeDeleted = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { isDeleted: true, deletedAt: moment() }, { new: true })

        if (!toBeDeleted) return res.status(404).send({ status: true, msg: "No data found" })

        return res.status(200).send({ status: true, msg: "Successfully deleted" })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


// --------------------------------------- deleteBlogs by Qyery ---------------------------------

let deleteBlogsByQuery = async function (req, res) {
    try {
        const temp = req.savedTemp
        temp.isDeleted = false

        const toBeDeleted = await blogModel.find(temp)//.select({ isDeleted: 1, _id: 0 })

        if (toBeDeleted.length == 0) return res.status(404).send({ status: false, msg: "No data found" })

        await blogModel.updateMany(temp, { isDeleted: true, deletedAt: moment() }, { new: true })

        return res.status(200).send({ status: true, msg: "Deleted succsesful" })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports = { createBlogs, getBlogs, updateBlog, deleteBlogsByParam, deleteBlogsByQuery }