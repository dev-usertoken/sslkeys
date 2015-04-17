var exports = module.exports = {};

var crypto = require("crypto");

exports.encrypt = function (password, plain_text) {
    var cipher = crypto.createCipher("aes256", password),
        msg = [];

        msg.push(cipher.update(plain_text, "binary", "hex"));

    msg.push(cipher.final("hex"));
    return(msg.join(""));

};

exports.decrypt = function (password, cipher_text) {
    var decipher = crypto.createDecipher("aes256", password),
        msg = [];

        msg.push(decipher.update(cipher_text, "hex", "binary"));

    msg.push(decipher.final("binary"));
    return(msg.join(""));
};
