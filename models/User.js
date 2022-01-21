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
    handle:{
        type : String,
        required : true,
        min: 4 
    },
    profilePicture: {
        type : String,
        default : ""
    },
    backgroundImage: {
        type : String,
        default : ""
    },
    description:{
        type : String,
        max : 100,
        default : ""
    },
    city : {
        type : String,
        max : 20,
        default : ""
    },
    from : {
        type : String,
        max : 20,
        default : ""
    },
    relationshipStatus : {
        type : Boolean,
        default : false
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