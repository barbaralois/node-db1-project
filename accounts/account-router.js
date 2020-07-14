const express = require('express');

const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
  db.select('*')
    .from('accounts')
    .then((accounts) => {
      res.status(200).json({ data: accounts });
    })
    .catch((err) => handleError(err, res));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('accounts')
    .where('id', id)
    .first()
    .then((account) => {
      res.status(200).json({ data: account });
    })
    .catch((err) => handleError(err, res));
});

router.post('/', (req, res) => {
  const accountData = req.body;
  db('accounts')
    .insert(accountData, 'id')
    .then((ids) => {
      db('accounts')
        // .where({ id: ids[0]})
        .first()
        .then((account) => {
          res.status(200).json({ data: account });
        })
        .catch((err) => handleError(err, res));
    })
    .catch((err) => handleError(err, res));
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db('accounts')
    .where({ id })
    .update(changes)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ data: count });
      } else {
        res.status(404).json({ message: 'There is no account with that ID.' });
      }
    })
    .catch((err) => handleError(err, res));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db('accounts')
    .where({ id })
    .del()
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ data: count });
      } else {
        res.status(404).json({ message: 'There is no account with that ID.' });
      }
    })
    .catch((err) => handleError(err, res));
});

function handleError(error, res) {
  console.log('error', error);
  res.status(500).json({ message: error.message });
}

module.exports = router;
