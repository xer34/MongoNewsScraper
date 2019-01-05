const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  NoteSchema = new Schema({
    title: String,
    body: String
  });
const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;
