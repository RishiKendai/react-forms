const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  surveyName: {
    type: String,
    required: true,
  },
  creatorId: mongoose.Schema.Types.ObjectId,
  createdDate: String,
  // questions: { type: Array, default: [] },
  questions: Array,
  amount: Number,
});

module.exports = mongoose.model('Survey', surveySchema);
// [question: {
//   id: mongoose.Schema.Types.ObjectId,
//   question: String,
//   answerType: String,
//   required: Boolean,
//   option: [],
// }],
