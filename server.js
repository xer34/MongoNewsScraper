const express = require("express"),
  logger = require("morgan"),
  mongoose = require("mongoose"),
  app = express(),
  PORT = 3000;
require("./routes/htmlRoutes")(app);
//------------------------
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI =
  "mongodb://user2:user2password@ds249824.mlab.com:49824/mongoscraper";
// process.env.MONGODB_URI || "mongodb://localhost/warhammer" ;

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
app.listen(PORT, () => console.log(`App running on port ${PORT}!`));
