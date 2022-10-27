const router = require('express').Router();
const rateLimitter = require('../middleware/rateLimitAPI');

const {
  createSurvey,
  viewSurvey,
  submitSurvey,
  allResponse,
  allSurvey,
  getAllSurvey,
  viewResponse,
  deleteForm,
} = require('../controller/formController');

const formCreate = require('../middleware/validation/formCreate');
const formSubmit = require('../middleware/validation/formSubmit');

router.post('/forms/create', formCreate, createSurvey);
router.post('/forms/all', allSurvey);
router.post('/forms/getAllSurvey', getAllSurvey);
router.get('/forms/response/:surveyId', allResponse);
router.get('/forms/response/', viewResponse);
router.post('/forms/deleteForm/', deleteForm);
router.post('/forms/:id/view', rateLimitter, viewSurvey);
router.post('/forms/submit/', formSubmit, submitSurvey);

module.exports = router;
