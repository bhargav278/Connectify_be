require('dotenv').config();
const express = require('express');
const postRouter = express.Router();
const multer = require('multer');
const { uploadPost, getPost } = require('../Utils/b2setup');
const { sendResponse } = require('../Utils/response');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { Post } = require('../../models')

postRouter.post('/uploadpost', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return sendResponse(400, { msg: "Not Valid File!" }, res);
        }

        const { userId } = req.user;
        const fileData = await uploadPost(req.file, "posts");

        const { imagePath: fileName } = await Post.create({
            ownerId: userId,
            caption: req.body.caption,
            imagePath: fileData.fileName
        })

        const viewUrl = await getPost(fileName)
        sendResponse(200, { success: true, msg: "Image Posted!", url: viewUrl }, res)
    }
    catch (err) {
        res.send(err)
    }
})

module.exports = postRouter