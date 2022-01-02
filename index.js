const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');

//Initializing the Express application
const app = express();

//Configuring the envinornment
dotenv.config();

//COnnecting to MongoDB Atlas
mongoose.connect(
    process.env.MONGODB_URL, 
    {useNewUrlParser: true, useUnifiedTopology: true},
    ()=> console.log("Connected to MongoDB Atlas")
);

//Applying Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors())

app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/posts",postsRoute)

app.listen(5000, ()=>{
    console.log("Server is running on localhost:5000");
})