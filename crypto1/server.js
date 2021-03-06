var MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
  , dotenv = require('dotenv').load()
  , e = require(__dirname + '/encdec.js');


var url = process.env.MongoDB || 'mongodb://localhost:27017/keys';
var counter = process.env.Counter || 10;

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  var col = db.collection('ssl');

  var bulk = col.initializeOrderedBulkOp();

  for(var i = 0; i < counter; i++) {
    if (!i) col.drop();
    bulk.insert(e.encrypt(i.toString()));
  }

  // bulk insert
  bulk.execute(function(err, result) {
    assert.equal(null, err);
  });

  // verify one
  col.find({}).limit(1).toArray(function(err, doc) {
//    console.log(doc[0]);
    var clearText = e.decrypt(doc[0]);
    console.log(clearText);
    db.close();
  });
});
