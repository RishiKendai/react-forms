module.exports = (req, res, next) => {
  const { surveyName, creatorId, createdDate, questions, amount } = req.body;
  // survey name
  if (surveyName === undefined || surveyName === '')
    return res.json({ status: false, msg: 'survey name is empty' });
  // creator id
  if (creatorId === undefined || creatorId === '')
    return res.status(403).json({ status: false, msg: 'Access Denied' });
  // created date
  if (createdDate === undefined || createdDate === '')
    return res.json({ status: false, msg: 'unknown error occurred' });
  // questions
  if (questions === undefined || questions.length < 1)
    return res.json({ status: false, msg: 'questions is empty' });
  // amount
  if (amount === undefined || amount === '')
    return res.json({ status: false, msg: 'amount is empty' });
  next();
};
