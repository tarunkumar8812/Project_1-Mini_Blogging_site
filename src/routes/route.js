const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const authMiddleware = require("../authMiddleware/authentication")


// --------------- Author's APIs ------------------
router.post("/authors", authorController.createAuthor)

router.post("/login", authorController.login)


// --------------- Blogs's APIs ------------------

router.post("/blogs", authMiddleware.authenticate, authMiddleware.authorisation, blogController.createBlogs)

router.get("/blogs", authMiddleware.authenticate, blogController.getBlogs)

router.put("/blogs/:blogId", authMiddleware.authenticate, authMiddleware.authorisation, blogController.updateBlog)

router.delete("/blogs/:blogId", authMiddleware.authenticate, authMiddleware.authorisation, blogController.deleteBlogsByParam)

router.delete("/blogs", authMiddleware.authenticate, authMiddleware.authorisation, blogController.deleteBlogsByQuery)



module.exports = router;