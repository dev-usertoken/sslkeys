var exports = module.exports = {};

var crypto = require('crypto');

/** Sync */
exports.randomString = function(length, chars) {
    if(!chars) {
        throw new Error('Argument \'chars\' is undefined');
    }

    var charsLength = chars.length;
    if(charsLength > 256) {
        throw new Error('Argument \'chars\' should not have more than 256 characters'
            + ', otherwise unpredictability will be broken');
    }

    var randomBytes = crypto.randomBytes(length)
    var result = new Array(length);

    var cursor = 0;
    for (var i = 0; i < length; i++) {
        cursor += randomBytes[i];
        result[i] = chars[cursor % charsLength]
    };

    return result.join('');
}

/** Sync */
exports.randomAsciiString = function(length) {
    return this.randomString(length,
        'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ' + '0123456789' + '!@#$%^&*()'
        );
}
