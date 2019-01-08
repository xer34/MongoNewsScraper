const axios = require("axios"),
  cheerio = require("cheerio"),
  db = require("../models");

module.exports = function(app) {
  // Routes
  app.get("/scrape", (req, res) => {
    axios
      .get("https://spikeybits.com/category/warhammer-40k")
      .then(({ data }) => {
        const $ = cheerio.load(data);
        $("article h2").each(function(i, element) {
          const result = {};
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
            .catch(err => res.json(err));
          console.log(result.link);
        });

        // var a = $('.entry-title').find('a').text()
        // console.log(a)

        res.send("You gonna get scraped");
      });
  });
  //------------------------
  app.get("/articles", (req, res) => {
    db.Article.find({})
      .then(A => res.json(A))
      .catch(err => res.json(err));
  });
  //------------------------
  app.get("/articles/:id", ({ params }, res) => {
    db.Article.findOne({ _id: params.id })
      .populate("note")
      .then(A => res.json(A))
      .catch(err => res.json(err));
  });
  //------------------------

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {

      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
})
}