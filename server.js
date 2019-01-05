const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");


require("./routes/htmlRoutes")

const app = express();
const PORT = 3000;
//------------------------
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/warhammer" ;

mongoose.connect(MONGODB_URI);
//------------------------
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
//------------------------
// mongoose.connect(
//   "mongodb://localhost/warhammer",
//   { useNewUrlParser: true }
// );
//------------------------

//------------------------
app.listen(PORT, () => console.log(`App running on port ${PORT}!`));


