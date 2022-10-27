module.exports = (req, res, next) => {
  const { surveyId, userId, answers, creatorId, surveyName } = req.body;
  // surveyId
  if (surveyId === undefined || surveyId === '')
    return res.json({ status: false, msg: 'unable to submit the response' });
  // userId
  if (userId === undefined || userId === '')
    return res.json({ status: false, msg: 'unable to submit the response' });
  // creatorId
  if (creatorId === undefined || creatorId === '')
    return res.json({ status: false, msg: 'unable to submit the response' });
  // surveyName
  if (surveyName === undefined || surveyName === '')
    return res.json({ status: false, msg: 'unable to submit the response' });
  // answers
  if (answers === undefined || answers.length < 1)
    return res.json({ status: false, msg: 'answers is empty' });
  next();
};
