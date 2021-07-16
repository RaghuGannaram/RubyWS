const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type :String,
    required :true
  },
  author:{
    type :String,
    required :true
  },
  body: {
    type :String,
    required :true
  },
  comments: [
    {
      blogId : {
        type : String,
        required : true
      },
      userId : {
        type : String,
        required : true
      },
      body: {
        type : String,
        required :true
      },
      commentator:String,
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
  ],
  date: {
    type: Date,
    default: Date.now
  },
  image :{
    type :String
  },
  likes: {
    type : Array,
    default : []
  },
  hidden: {
    type : Boolean,
    default : false
  }
});
module.exports = mongoose.model("Blog", BlogSchema);
