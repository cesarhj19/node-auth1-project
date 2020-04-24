const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');

router.post('/', (req, res) => {
  const { username, password } = req.body;
  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = true;
        res.status(200).json({ message: `Welcome ${username}` });
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: 'error while logging in the database',
        message: err.message,
      });
    });
});

module.exports = router;
