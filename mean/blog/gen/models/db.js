var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/test';
mongoose.set('debug', false /*function (coll, method, query, doc) {
    console.log(">>>>>>>>>>");
    console.log("Collection: " + coll);
    console.log("Method: " + method);
    console.log("Query: " + JSON.stringify(query));
    console.log("Doc: " + JSON.stringify(doc));
    console.log("<<<<<<<<<");
}*/);
mongoose.connect(dbURI);
mongoose.connection.on('error', function (err) { console.log(err); } );
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});
var exports = module.exports = mongoose;
