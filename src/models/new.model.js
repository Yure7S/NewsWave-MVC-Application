const mongoose = require("mongoose")

const newSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    views: {
        type: Number
    }
})

const Posts = mongoose.model("Posts", newSchema)

module.exports = Posts