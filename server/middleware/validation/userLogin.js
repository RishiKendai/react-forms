module.exports = (req, res, next) => {
  const { email, password } = req.body;
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
