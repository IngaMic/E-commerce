const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const cors = require("cors");
const expressValidator = require("express-validator");

const userRoutes = require("./routes/user");

const app = express();

mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
    })
    .then(() => console.log("DB Connected"));

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

app.use("/api", userRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Serer is running ${port}`);
});
