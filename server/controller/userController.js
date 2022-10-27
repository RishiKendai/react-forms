const User = require('../model/userModel');
const bcryptjs = require('bcryptjs');
// register
module.exports.register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    const hasUser = await User.findOne({ email });
    if (hasUser)
      return res.json({ status: false, msg: 'user already exists.' });

    const hashedPassword = await bcryptjs.hash(password, 10);
    let user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });
    if (!user)
      return res.json({
        status: false,
        msg: "couldn't create user ",
      });
    user = {
      _id: user._id,
      name: user.userName,
      surveys: user.surveys,
      amount: user.amount,
    };

    return res.status(201).json({ status: true, user });
  } catch (err) {
    if (err)
      return res
        .status(400)
        .json({ status: false, msg: 'unable to create user' });
  }
};

// login
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({
        status: false,
        msg: 'Incorrect username',
      });
    }
    const isDecryptedPassword = await bcryptjs.compare(password, user.password);
    if (!isDecryptedPassword)
      return res.json({
        status: false,
        msg: 'Incorrect password',
      });
    user = {
      _id: user._id,
      name: user.userName,
      surveys: user.surveys,
      amount: user.amount,
    };
    return res.status(200).json({ status: true, user });
  } catch (err) {
    return res.status(406).json(`could not login, ${err}`);
  }
};
