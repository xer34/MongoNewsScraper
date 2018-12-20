const express = require("express"),
  logger = require("morgan"),
  mongoose = require("mongoose"),
  axios = require("axios"),
  cheerio = require("cheerio"),
  db = require("./models"),
  app = express(),
  PORT = 3000;
//------------------------
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
//------------------------
mongoose.connect(
  "mongodb://localhost/warhammer",
  { useNewUrlParser: true }
);
// Routes
app.get("/scrape", (req, res) => {
  axios.get("https://spikeybits.com/category/warhammer-40k").then(response => {
    var $ = cheerio.load(response.data);
    $("article h2").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      result.summary = $(this)
        .siblings(".fusion-post-content-container")
        .children("p")
        .text();
      db.Article.create(result)
        .then(A => console.log(A))
        .catch(err => {
          return res.json(err);
        });
    });

    // var a = $('.entry-title').find('a').text()
    // console.log(a)

    res.send("Scrape Complete");
  });
});
//------------------------
app.get("/articles", (req, res) => {
  db.Article.find({})
    .then(A => res.json(A))
    .catch(err => res.json(err));
});
//------------------------
app.get("/articles/:id", (req, res) => {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(A => res.json(A))
    .catch(err => res.json(err));
});
//------------------------
app.post("/articles/:id", (req, res) => {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(A => res.json(A))
    .catch(err => res.json(err));
});
//------------------------
app.listen(PORT, () => console.log("App running on port " + PORT + "!"));
