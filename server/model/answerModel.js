const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  surveyId: mongoose.Schema.Types.ObjectId,
  creatorId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  surveyName: String,
  answers: Array,
  // questionId: mongoose.Schema.Types.ObjectId,
  // question: String,
  // answerType: String,
  // answer: Array,
});

module.exports = mongoose.model('Answer', answerSchema);
