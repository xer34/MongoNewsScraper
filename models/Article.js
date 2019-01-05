const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ArticleSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: false
    },
    note: {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  });
const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
