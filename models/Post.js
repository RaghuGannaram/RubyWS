const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
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
      type: String,
      max: 500,
      required :true
    },
    img: {
      type: String,
      default:""
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
