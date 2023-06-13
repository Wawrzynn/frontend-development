const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  completed: { type: Boolean, require: true },
  editing: { type: Boolean, require: false},
  date: { type: Date, require: false }
});

module.exports = mongoose.model("Todo", todoSchema);
