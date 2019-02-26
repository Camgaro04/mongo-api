var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    question: String,
    author: String,
    category: String,
    formtype:String
  });
  
  module.exports = mongoose.model('questions', QuestionSchema);