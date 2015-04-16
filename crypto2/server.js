
var bf = new Blowfish('some key');
var ciphertext = bf.encrypt('some plaintext');
var plaintext = bf.decrypt('some encrypted text');

console.log("encryptedText: " + ciphertext);
console.log("decryptedText: " + plaintext);

