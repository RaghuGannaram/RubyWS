const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        author:{
            id: {
              type: String,
              required: true,
            },
            name:{
              type: String,
              required: true,
            },
            handle:{
              type: String,
              required: true
            }
          },
          description: {
            type : String,
            required :true
          },
          date: {
            type : Date,
            default: Date.now
          },
          likes: {
            type : Array,
            default : []
          },
          hidden: {
            type : Boolean,
            default : false
          }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Comment", CommentSchema);