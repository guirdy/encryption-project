// necessário para fazer uso da biblioteca cryptr
const Cryptr = require('cryptr');
const fs = require('fs');
const pdf = require('pdf-parse');

// função que será usada para as requisições do tipo POST 
// (o nome post pode ser alterado para qualquer outro coisa, o que manda mesmo é o que está nas routes)
// (coloquei post para ficar óbvio que estamos mexendo no post, da pra mudar futuramente)
exports.post = function (req, res) {
    
    // pega as informações do body (secret, btn_crypto e file são os names dos inputs)
    
    let { secret, btn_crypto, fileupload } = req.body;

    let dataBuffer = fs.readFileSync(fileupload);

    pdf(dataBuffer).then(function (data) {

        // numero de paginas
        console.log(data.numpages);
        // PDF informações
        console.log(data.info);
        // PDF texto
        console.log(data.text);

    });

    const cryptr = new Cryptr('senha_secreta');
    const encryptedString = cryptr.encrypt(secret)
    const decryptedString = cryptr.decrypt(encryptedString);

    return res.send(`Decrypted = ${decryptedString} | Encrypted = ${encryptedString} | File = ${fileupload}`)
}
