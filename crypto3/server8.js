var mongo = require('mongodb-next');
var fs = require('fs');
var pki = require('./pki.js');

var attrs = [{ name: 'commonName', value: 'ca.usertoken.com' },
            { name: 'countryName', value: 'US' },
            { shortName: 'ST', value: 'DE' },
            { name: 'localityName', value: 'Wilmington' },
            { name: 'organizationName', value: 'User Token' },
            { shortName: 'OU', value: 'Research and Development' }];

// var db = mongo("mongodb://localhost:27017/keys", { w: 'majority' });
var db = mongo("mongodb://rw:rw-2015@ds061721.mongolab.com:61721/keys", { w: 0 });
  db.connect.then(function () {
    col = db.collection('ssl');
    var count = 10000;
    while(count) {
      var serial = 80000+count-1;
      col.insert(pki.createCertificate(attrs, serial.toString(16))).then(function (things) {
        console.log(things)
      })
      count--;
    }
  console.log("DONE: ");
  });
