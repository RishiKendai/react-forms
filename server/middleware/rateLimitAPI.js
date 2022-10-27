const moment = require('moment/moment');
const RateLimit = require('../model/rateLimitModel');

const WINDOW_SIZE_IN_MINUTE = 60;
const MAX_WINDOW_REQUEST_COUNT = 2;
const WINDOW_LOG_INTERVAL_IN_MUNUTE = 1;

module.exports = async (req, res, next) => {
  try {
    const record = await RateLimit.findOne({ ipAddress: req.ip });
    const currentRequestTime = moment();

    // if user Not found in rateLimit DB
    if (record === null) {
      let newRecord = [];
      let requestLog = {
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1,
      };
      newRecord.push(requestLog);
      const value = JSON.stringify(newRecord);
      const rateLimit = RateLimit.create({
        ipAddress: req.ip,
        value: value,
      });
      next();
    }
    // if user Found in rateLimit DB

    let data = JSON.parse(record.value);
    let windowStartTimeStamp = moment()
      .subtract(WINDOW_SIZE_IN_MINUTE, 'seconds')
      .unix();
    let requestsWithWindow = data.filter((entry) => {
      return entry.requestTimeStamp > windowStartTimeStamp;
    });
    let totalWindowRequestsCount = requestsWithWindow.reduce((prev, curr) => {
      return prev + curr.requestCount;
    }, 0);
    // if number of request made is greater return error
    if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
      res.json({
        status: '429',
        msg: `you have exceeded the ${MAX_WINDOW_REQUEST_COUNT} reqeusts in ${
          WINDOW_SIZE_IN_MINUTE / 60
        } minute limit!`,
      });
    }
    // if number of request made is less, log new entry
    else {
      let lastRequestLog = data[data.length - 1];
      let currentWindowIntervalStartTimeStamp = currentRequestTime
        .subtract(WINDOW_LOG_INTERVAL_IN_MUNUTE, 'seconds')
        .unix();
      // if interval not passed in last request log increase the counter
      if (
        lastRequestLog.requestTimeStamp > currentWindowIntervalStartTimeStamp
      ) {
        lastRequestLog.requestCount++;
        data[data.length - 1] = lastRequestLog;
      } else {
        // if interval has passed, log new entry for current user and timestamp
        data.push({
          requestTimeStamp: currentRequestTime.unix(),
          requestCount: 1,
        });
      }
      await RateLimit.findByIdAndUpdate(
        { _id: record._id },
        { value: JSON.stringify(data) }
      );
      next();
    }
  } catch (err) {
    res.json({ status: false, msg: err });
  }
};
