var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurveySchema = new Schema({
    title: String,
    author: String,
    category: String,
    questions: [{
        question: String,
        author: String,
        category: String,
        formtype:String
    }],
    isactive: Boolean
  });
  
  module.exports = mongoose.model('surveys', SurveySchema);
