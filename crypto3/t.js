var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));

fs.readFileAsync("fqdn.json", "utf-8").then(function (json) {
    console.log("Successful json")
    return(json);
}).catch(SyntaxError, function (e) {
    console.error("file contains invalid json");
}).catch(Promise.OperationalError, function (e) {
    console.error("unable to read file, because: ", e.message);
});
