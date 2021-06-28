const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type : String,
        require : true,
        min : 3,
        max : 20,
        unique : true
    },
    email: {
        type : String,
        require : true,
        min : 12,
        unique : true
    },
    password: {
        type : String,
        require : true,
        min : 8
    },
    profilePicture: {
        type : String,
        default : ""
    },
    description:{
        type : String,
        max : 100
    },
    city : {
        type : String,
        max : 20
    },
    from : {
        type : String,
        max : 20
    },
    relationshipStatus : {
        type : Boolean
    },
    followers: {
        type : Array,
        default : []
    },
    following : {
        type : Array,
        default : []
    },
    adminStatus : {
        type : Boolean,
        default : false
    }
},
{timestamps : true})

module.exports = mongoose.model("User",UserSchema);