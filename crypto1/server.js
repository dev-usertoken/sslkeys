var mongo = require('mongoskin');

var db = mongo.db("mongodb://localhost:27017/keys", {native_parser:true});

var col = db.collection('ssl', {strict: true});

col.insert({foo: 'bar'}, function(err, result) {
    console.log(result);
    db.close();

});
