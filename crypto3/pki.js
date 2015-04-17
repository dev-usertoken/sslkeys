/* from https://github.com/digitalbazaar/bedrock-seed/blob/master/create-credentials.js */

var exports = module.exports = {};

var forge = require('node-forge');

exports.createCertificate = function (attrs, serial) {

// console.log('Generating 2048-bit key-pair...');
var keys = forge.pki.rsa.generateKeyPair(2048);
// console.log('Key-pair created.');

// console.log('Creating self-signed certificate...');
var cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = serial; // cert.serialNumber = serial + forge.util.bytesToHex(forge.random.getBytesSync(19));
// console.log("serial: " + serial);
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 20);

// needs attrs from external source

cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.setExtensions([{
  name: 'subjectKeyIdentifier'
}, {
  name: 'basicConstraints',
  cA: true
}]);

// self-sign certificate
cert.sign(keys.privateKey, forge.md.sha256.create());
// console.log('Certificate created.');

// PEM-format keys and cert
var pem = {
  privateKey: forge.pki.privateKeyToPem(keys.privateKey),
  publicKey: forge.pki.publicKeyToPem(keys.publicKey),
  certificate: forge.pki.certificateToPem(cert)
};

// console.log('\nKey-Pair:');
// console.log(pem.privateKey);
// console.log(pem.publicKey);

// console.log('\nCertificate:');
// console.log(pem.certificate);

// verify certificate
var caStore = forge.pki.createCaStore();
caStore.addCertificate(cert);
try {
  forge.pki.verifyCertificateChain(caStore, [cert],
    function(vfd, depth, chain) {
      if(vfd === true) {
// console.log('SubjectKeyIdentifier verified: ' +
          cert.verifySubjectKeyIdentifier();
// console.log('Certificate verified.');
      }
      return true;
  });
} catch(ex) {
// console.log('Certificate verification failure: ' + JSON.stringify(ex, null, 2));
}
// console.log(pem);
var certClean =
[
          {"privateKey": JSON.parse(JSON.stringify(pem.privateKey).replace(/\\r\\nMI/gm, " MI").replace(/\\r\\n-----END/gm, " -----END").replace(/\\r\\n/gm, ""))},
          {"publicKey": JSON.parse(JSON.stringify(pem.publicKey).replace(/\\r\\nMI/gm, " MI").replace(/\\r\\n-----END/gm, " -----END").replace(/\\r\\n/gm, ""))},
          {"certificate": JSON.parse(JSON.stringify(pem.certificate).replace(/\\r\\nMI/gm, " MI").replace(/\\r\\n-----END/gm, " -----END").replace(/\\r\\n/gm, ""))}
          ];

var certRaw = [{"serial": cert.serialNumber}, {"privateKey": pem.privateKey}, {"publicKey": pem.publicKey}, {"certificate": pem.certificate}];

var certCooked = {};
certCooked.privateKey = pem.privateKey;
certCooked.publicKey = pem.publicKey;
certCooked.certificate = pem.certificate;

stringOut = {};
stringOut.userId = parseInt(serial, 16);
stringOut.certs = certCooked;
console.log("serial: " + serial + " Int: " + stringOut.userId);

return (stringOut);
};
