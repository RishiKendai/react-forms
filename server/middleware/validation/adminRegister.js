module.exports = (req, res, next) => {
  const { adminName, email, password } = req.body;
  // adminName
  if (adminName === '' || adminName === undefined)
    return res.json({ status: false, msg: 'adminName is empty' });
  if (adminName.length < 3 || adminName.length > 20)
    return res.json({ status: false, msg: 'enter valid adminName' });
  // email
  if (email === '' || email === undefined)
    return res.json({ status: false, msg: 'email is empty' });
  const emailPattern =
    /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+)\.([a-z]{2,8})(.[a-z]{2,8})?$/;
  if (!emailPattern.test(email))
    return res.json({ status: false, msg: 'invalid email' });
  // password
  if (password === '' || password === undefined)
    return res.json({ status: false, msg: 'password is empty' });
  if (password.length < 3 || password.length > 20)
    return res.json({ status: false, msg: 'enter valid password' });

  next();
};
