const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');

router.post('/', (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((err) => {
      res.status(500).send({
        error: 'error adding user to database',
        message: err.message,
      });
    });
});

module.exports = router;
