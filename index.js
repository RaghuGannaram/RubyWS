const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const connectDatabase = require("./config/database.js");
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');

const app = express();

dotenv.config({path: "./config/.env"});
const port = process.env.PORT || 5000;

connectDatabase()

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors())

app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/posts",postsRoute)


app.listen(port, ()=>{
    console.log(`Server is running on localhost:${port}`);
})