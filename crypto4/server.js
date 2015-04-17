var e = require(__dirname + '/encdec.js');

  var password = "password";
  var plain_text = "text plain clear";

  var cipher_text = e.encrypt(password, plain_text);
  console.log(cipher_text);

  var decrypt_text = e.decrypt(password, cipher_text);
  console.log(decrypt_text);
