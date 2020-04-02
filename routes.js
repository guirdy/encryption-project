const express = require('express');
const routes = express.Router();
const fs = require('fs');

//Biblioteca node para upload de arquivos
const multer = require('multer');

//Salva o aquivo de upload na pasta upload e renomeia
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, 'crypt-this.txt');
    }
});

const upload = multer({ storage });

// rota padrão para quando acessa o localhost:5000 
routes.get('/', function (req, res) {
    return res.render("index")
});

// rota para o post do localhost:5000
routes.post('/', upload.single('fileupload'), function (req, res) {

    function createFile() {

        // leitura do arquivo
        fs.readFile('./uploads/crypt-this.txt', 'utf8', function(err, data) {
            if(err) {
                console.error('Could not open file: %s', err)
                process.exit(1)
            }
            let encryptedString = cesar(data, 5, (req.body.btn_crypto == 'encrypt'))
            //Cria o arquivo txt
            res.writeHead(200,
                {
                    'Content-Type': 'text/plain',
                    'Content-Disposition': `attachment;filename="${req.body.btn_crypto}.txt"`
                });
            //Faz download do arquivo no navegador  
            const download = Buffer.from(encryptedString);
            res.end(download);
        })
    }
  
    createFile();
});

//Função de criptografia baseada em Cifra de Cesar
function cesar(text, deslocamento, criptografar) {
    const tamAscii = 256;
    let cifra = "";
    if(!criptografar) {
        deslocamento *= -1;
    }
    for (let letra of text) {
        cifra += String.fromCharCode(((letra.charCodeAt(0) + deslocamento) % tamAscii))
    }
    return cifra;
}

module.exports = routes;
