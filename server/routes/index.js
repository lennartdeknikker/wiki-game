const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs-extra');




const headers = {
  contentType: 'text/xml'
}

async function getStops() {
  await fetch('http://data.ndovloket.nl/haltes/PassengerStopAssignmentExportCHB20200420030138.xml.gz', { method: 'GET', compress: false})
  .then(res => res.text())
  .then(body => fs.writeFile('test.xml', body, 'binary'))
}

getStops()


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
