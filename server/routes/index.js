const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs-extra');





/* GET home page. */
router.get('/', async function(req, res, next) {  
  const text = await fetch('http://acc.data.ndovloket.nl/ACTUEEL.TXT')
  res.render('index', { title: text });
});

module.exports = router;
