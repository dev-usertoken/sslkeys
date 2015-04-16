/*
 Copyright 2014 Levi Gross. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 */

var exports = module.exports = {};

var crypto = require('crypto');
var ALGORITHM, HMAC_ALGORITHM;



exports.encrypt = function (plain_text) {

    var ALGORITHM = 'AES-256-CBC'; // CBC because CTR isn't possible with the current version of the Node.JS crypto library
    var HMAC_ALGORITHM = 'SHA256';
    var KEY = crypto.randomBytes(32); // This key should be stored in an environment variable
    var HMAC_KEY = crypto.randomBytes(32); // This key should be stored in an environment variable
    var IV = new Buffer(crypto.randomBytes(16)); // ensure that the IV (initialization vector) is random
    var cipher_text;
    var hmac;
    var encryptor;

    encryptor = crypto.createCipheriv(ALGORITHM, KEY, IV);
    encryptor.setEncoding('hex');
    encryptor.write(plain_text);
    encryptor.end();

    cipher_text = encryptor.read();

    hmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
    hmac.update(cipher_text);
    hmac.update(IV.toString('hex')); // ensure that both the IV and the cipher-text is protected by the HMAC

    // The IV isn't a secret so it can be stored along side everything else
//    return cipher_text + "$" + IV.toString('hex') + "$" + hmac.digest('hex')
    var output = {algorithm: ALGORITHM, hmacAlgorithm: HMAC_ALGORITHM, key: KEY, hmacKey: HMAC_KEY, cipherText: cipher_text
                  , IV:  IV.toString('hex') , hmacDigest:  hmac.digest('hex')};
    return output;

};

exports.decrypt = function (cipher_text) {

    var c = cipher_text;
    var ct = c.cipherText;
    var IV = new Buffer(c.IV, 'hex');
    var hmac = c.hmacDigest;
    var KEY = c.key;
    var HMAC_KEY = c.hmacKey;
    var HMAC_ALGORITHM = c.hmacAlgorithm;
    var ALGORITHM = c.algorithm;
    var decryptor;

    chmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
    chmac.update(ct);
    chmac.update(IV.toString('hex'));

    if (!constant_time_compare(chmac.digest('hex'), hmac)) {
        console.log("Encrypted Blob has been tampered with...");
        return null;
    }

    decryptor = crypto.createDecipheriv(ALGORITHM, KEY, IV);
    decryptor.update(ct, 'hex', 'utf8');
    return decryptor.final('utf-8')


};

var constant_time_compare = function (val1, val2) {
    var sentinel;

    if (val1.length !== val2.length) {
        return false;
    }


    for (var i = 0; i <= (val1.length - 1); i++) {
        sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
    }

    return sentinel === 0
};

