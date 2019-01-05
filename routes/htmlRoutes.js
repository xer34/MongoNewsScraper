const express = require("express");
const app = express();

// Routes
app.get("/scrape", (req, res) => {
    axios.get("https://spikeybits.com/category/warhammer-40k").then(({data}) => {
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
          console.log(result.link)
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
  app.get("/articles/:id", ({params}, res) => {
    db.Article.findOne({ _id: params.id })
      .populate("note")
      .then(A => res.json(A))
      .catch(err => res.json(err));
  });
  //------------------------
  app.post("/articles/:id", ({body, params}, res) => {
    db.Note.create(body)
      .then(({_id}) => db.Article.findOneAndUpdate(
      { _id: params.id },
      { note: _id },
      { new: true }
    ))
      .then(A => res.json(A))
      .catch(err => res.json(err));
  });

