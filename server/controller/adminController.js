const Admin = require('../model/adminModel');
const bcryptjs = require('bcryptjs');

// Admin Register
module.exports.register = async (req, res, next) => {
  try {
    const { adminName, email, password } = req.body;
    const hasAdminAcc = await Admin.findOne({ email });
    if (hasAdminAcc)
      return res.json({
        msg: 'admin already exists.',
        status: false,
      });
    const hashedPassword = await bcryptjs.hash(password, 10);
    let admin = await Admin.create({
      adminName,
      email,
      password: hashedPassword,
    });
    admin = {
      _id: admin._id,
      name: admin.adminName,
    };
    return res.status(201).json({ status: true, admin });
  } catch (err) {
    return res.status(406).json(`could not create admin ${err}`);
  }
};
// Admin Login
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({
        msg: 'Incorrect username',
        status: false,
      });
    }
    const isDecryptedPassword = await bcryptjs.compare(
      password,
      admin.password
    );
    if (!isDecryptedPassword)
      return res.json({
        msg: 'Incorrect password',
        status: false,
      });
    admin = {
      _id: admin._id,
      name: admin.adminName,
    };
    return res.status(200).json({ status: true, admin });
  } catch (err) {
    return res.status(406).json(`could not login, ${err}`);
  }
};

