const router = require('express').Router();
const { query, validationResult } = require('express-validator');

const lookup = require('../services/lookup');
const { BadRequestError } = require('../errors');

/* GET home page. */
router.get('/', query('ip').isIP(), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new BadRequestError(errors.array());
    return next(err);
  }

  try {
    const ip = req.query.ip;
    const result = await lookup(ip);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
