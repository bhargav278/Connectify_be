require('dotenv').config()
const express = require('express');
const connectDB = require('./src/Config/database');
const app = express();
const cookieParser = require('cookie-parser');
const userAuth = require('./src/Middlewares/userAuth')
const cors = require('cors')

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./src/Routes/auth');
const connectionRouter = require('./src/Routes/connectionRequest');

app.use("/", authRouter);
app.use("/connection", userAuth, connectionRouter)


// app.get("/Home", userAuth, async (req, res) => {
//     try {
//         res.send("This is home page");
//     }
//     catch (errapp.get("/Home", userAuth, async (req, res) => {
//     try {
//         res.send("This is home page");
//     }
//     catch (error) {
//         res.send("ERROR : " + error.message);
//     }
// })or) {
//         res.send("ERROR : " + error.message);
//     }
// })

connectDB()
    .then(() => {
        console.log("connection established");
        app.listen(process.env.PORT, () => { console.log("Connectify is working") });
    })
    .catch(() => {
        console.log("Can't connect to DataBase");
    })