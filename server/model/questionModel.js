const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  surveyId: mongoose.Schema.Types.ObjectId,
  questionId:mongoose.Schema.Types.ObjectId,
  question: String,
  answerType: String,
  required: Boolean,
  option: [],
});

module.exports = mongoose.model('Question', questionSchema);
