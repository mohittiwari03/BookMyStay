const mongoose = require("mongoose");
const { schema } = require("../schema");
const { string, date, types } = require("joi");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:String,
        default : Date.now()
    },
    author: {
        type:Schema.Types.ObjectId,
        ref:"user"
    }
});

module.exports = mongoose.model("Review", reviewSchema);