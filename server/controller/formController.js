const Admin = require('../model/adminModel');
const Survey = require('../model/surveyModel');
const User = require('../model/userModel');
const Answer = require('../model/answerModel');

// form create
/*
http://localhost:5000/api/forms/create POST
{
	"surveyName" : "Elective Process",
	"creatorId" :"635267128d2560d947a9de83",
	"createdDate": "21/10/2022",
	"questions":[{
                    "id":"100",
                    "question":"choose elective 1",
                    "answerType":"radio-btn",
                    "required": true,
                    "option": ["block chain","ooad","ui/ux"]
                },{
                    "id":"101",
                    "question":"choose elective 2",
                    "answerType":"drop-down",
                    "required": true,
                    "option": ["block chain","ooad","ui/ux"]
                },{
                    "id":"102",
                    "question":"choose elective 3",
                    "answerType":"radio-btn",
                    "required": true,
                    "option": ["block chain","ooad","ui/ux"]
                }],
	"amount":120	
}

*/
// create survey
module.exports.createSurvey = async (req, res, next) => {
  try {
    const { surveyName, creatorId, createdDate, questions, amount } = req.body;
    let admin = await Admin.findById({ _id: creatorId });
    if (!admin)
      return res.status(401).json({ status: false, msg: 'access denied' });
    Survey.create(
      {
        surveyName,
        creatorId,
        createdDate,
        questions,
        amount,
      },
      function (err, data) {
        if (err)
          return res.json({ status: false, msg: "couldn't create form" });
        return res.status(201).json({
          status: true,
          msg: 'form created successfully',
          link: `http://localhost:5000/api/forms/${data._id}/view`,
        });
      }
    );
  } catch (err) {
    return res
      .status(400)
      .json({ status: false, msg: `unable to create the form, ${err}` });
  }
};
// form view (get the form to answer)
// http://localhost:5000/api/forms/6352b9011339d12313798463/view
module.exports.viewSurvey = async (req, res, next) => {
  try {
    const surveyId = req.params.id;
    const { userId } = req.body;
    if (
      surveyId === undefined ||
      userId === undefined ||
      surveyId === '' ||
      userId === ''
    )
      return res.json({ msg: 'empty' });
    //
    const hasUserCompletedTheForm = await User.findOne({
      _id: userId,
      surveys: { $in: [surveyId] },
    });
    if (hasUserCompletedTheForm)
      return res
        .status(200)
        .json({ status: 'completed', msg: 'you have completed this form' });
    //
    const survey = await Survey.findById({ _id: surveyId });
    if (!survey)
      return res.status(501).json({ msg: `unable to fetch form, ${err}` });
    return res.status(200).json({ status: true, survey });
  } catch (err) {
    return res.status(503).json({ msg: `unable to fetch form, ${err}` });
  }
};
// form submit http://localhost:5000/api/forms/submit
/*
{
	"surveyId":"6352b9011339d12313798463",
	"userId":"63535cf972c40610b643c1e3",
	"answers": [{"id":"100","question":"choose elective 1","answerType":"radio-btn","required":true,"option":["ooad"]},
							{"id":"101","question":"choose elective 2","answerType":"drop-down","required":true,"option":["ui/ux"]},
							{"id":"103","question":"choose elective 3","answerType":"radio-btn","required":true,"option":["block chain"]}]
  creatorId,
  surveyName
}
*/
module.exports.submitSurvey = async (req, res, next) => {
  try {
    const { surveyId, userId, answers, creatorId, surveyName } = req.body;
    const survey = await Survey.findById({ _id: surveyId });
    if (!survey)
      return res
        .status(503)
        .json({ status: false, msg: `unable to submit the form, ${err}` });
    const amount = survey.amount;
    const answer = await Answer.create({
      surveyId,
      creatorId,
      userId,
      surveyName,
      answers,
    });
    if (!answer)
      return res.json({
        status: false,
        msg: "couldn't able to  submit the asnwers",
      });
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { $inc: { amount: amount }, $push: { surveys: surveyId } },
      { new: true }
    );
    if (!updatedUser)
      return res.json({
        status: false,
        msg: `couldn't able to update the users, ${err}`,
      });
    const user = {
      _id: updatedUser._id,
      name: updatedUser.adminName,
      surveys: updatedUser.surveys,
      amount: updatedUser.amount,
    };
    return res.status(200).json({
      status: true,
      msg: 'answers submitted successfully',
      user,
    });
  } catch (err) {
    return res
      .status(503)
      .json({ status: false, msg: `unable to submit form, ${err}` });
  }
};
// form all response
module.exports.allSurvey = async (req, res, next) => {
  try {
    const { adminId } = req.body;
    if (adminId === '' || adminId === undefined)
      return res.json({ msg: 'adminId is empty' });
    Survey.find({ creatorId: adminId }, (err, response) => {
      if (err)
        return res
          .status(501)
          .json({ status: false, msg: `unable to fetch responses, ${err}` });
      return res.status(200).json({
        status: true,
        response,
      });
    });
  } catch (err) {
    if (err)
      return res
        .status(503)
        .json({ status: false, msg: `unable to submit form, ${err}` });
  }
};
// form all response for user
module.exports.getAllSurvey = async (req, res, next) => {
  try {
    Survey.find((err, response) => {
      if (err)
        return res
          .status(501)
          .json({ status: false, msg: `unable to fetch responses, ${err}` });
      return res.status(200).json({ status: true, response });
    });
  } catch (err) {
    if (err)
      return res
        .status(503)
        .json({ status: false, msg: `unable to submit form, ${err}` });
  }
};
// form all response
module.exports.allResponse = async (req, res, next) => {
  try {
    const { surveyId } = req.params;
    if (surveyId === '' || surveyId === undefined)
      return res.json({ msg: 'surveyId is empty' });
    const Answers = await Answer.find(
      { surveyId: surveyId },
      { userId: 1, answers: 1, _id: 0 }
    );
    if (!Answers) {
      return res
        .status(501)
        .json({ status: false, msg: `unable to fetch responses, ${err}` });
    }
    const questionArr = await Survey.findOne(
      { _id: surveyId },
      { questions: 1, surveyName: 1, _id: 0 }
    );
    const surveyName = questionArr.surveyName;
    questionArr.questions.forEach((q) => {
      const answers = [];
      Answers.forEach((ans) => {
        ans.answers.forEach((a) => {
          if (q.id === a.id) {
            answers.push(...a.option);
          }
        });
      });
      const updatedAnwers = [];
      const customBackground = [];
      const customBorder = [];

      let typeBool =
        q.answerType === 'check-box' || q.answerType === 'drop-down'
          ? 'cb'
          : 'o';

      let hue = Math.floor(Math.random() * 360);
      let saturate = Math.floor(Math.random() * (100 - 40) + 40);
      let light = Math.floor(Math.random() * (60 - 50) + 30);
      customBackground.push(`hsl(${hue}, ${saturate}%, ${light}%, 0.2)`);
      customBorder.push(`hsl(${hue}, ${saturate}%, ${light}%)`);
      q.option?.forEach((opt) => {
        const count = answers.reduce((prev, curr) => {
          curr == opt && prev++;
          return prev;
        }, 0);
        updatedAnwers.push(+count);
        let borColor;
        let backColor;
        if (typeBool !== 'cb') {
          do {
            let hue = Math.floor(Math.random() * 360);
            let saturate = Math.floor(Math.random() * (100 - 40) + 40);
            let light = Math.floor(Math.random() * (60 - 50) + 30);
            borColor = `hsl(${hue}, ${saturate}%, ${light}%)`;
            backColor = `hsl(${hue}, ${saturate}%, ${light}%, 0.2)`;
            if (!customBackground.includes(backColor)) {
              customBackground.push(backColor);
              customBorder.push(borColor);
              break;
            }
          } while (true);
        }
      });
      q.customBackground = customBackground;
      q.customBorder = customBorder;
      q.answers = updatedAnwers;
    });
    return res.status(200).json({
      status: true,
      response: Answers,
      surveyName,
      report: questionArr,
    });
  } catch (err) {
    if (err)
      return res
        .status(503)
        .json({ status: false, msg: `unable to submit form, ${err}` });
  }
};
// form particular response
module.exports.viewResponse = async (req, res, next) => {
  try {
    const responseId = req.params.id;
    Answer.findById({ _id: responseId }, (err, response) => {
      if (err)
        return res
          .status(501)
          .json({ status: false, msg: `unable to fetch responses, ${err}` });
      return res.status(200).json({ status: true, response });
    });
  } catch (err) {
    if (err)
      return res
        .status(503)
        .json({ status: false, msg: `unable to submit form, ${err}` });
  }
};

// delete particular form
module.exports.deleteForm = async (req, res) => {
  try {
    const { formId } = req.body;
    if (formId === undefined || formId === '')
      return res
        .status(501)
        .json({ status: false, msg: `unable to delete the form` });
    Survey.deleteOne({ _id: formId }, (err) => {
      if (err)
        return res
          .status(501)
          .json({ status: false, msg: `unable to delete form, ${err}` });
      Answer.deleteMany({ surveyId: formId }, (err) => {
        if (err)
          return res
            .status(501)
            .json({ status: false, msg: `unable to delete form, ${err}` });
        return res
          .status(200)
          .json({ status: true, msg: 'form deleted succsssfully' });
      });
    });
  } catch (err) {
    if (err)
      return res
        .status(503)
        .json({ status: false, msg: `unable to submit form, ${err}` });
  }
};
