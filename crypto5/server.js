var MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
  , e = require(__dirname + '/randomString.js')
  , dotenv = require('dotenv').load();

var url = process.env.MongoDB || 'mongodb://localhost:27017/keys';
var count = process.env.Counter || 10;
var dropCollection = process.env.DropCollection || 0;
var counterStart = process.env.CounterStart || 0;
var counterEnd = process.env.CounterEnd || 10;

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  var col = db.collection('tokens');
  var bulk = col.initializeUnorderedBulkOp();

  if(dropCollection) col.drop();

  for(var i = counterStart; i < counterEnd; i++) {
    var string = e.randomAsciiString(256);
    var query = {tokenId: i, token: string}
    bulk.insert(query);
  };

  bulk.execute(function(err, result) {
    assert.equal(null, err);
    db.close();
  });
});
