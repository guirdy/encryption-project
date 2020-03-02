const express = require('express');
const routes = express.Router();
const Cryptr = require('cryptr');
const fs = require('fs');
const pdf = require('pdf-parse');

//Biblioteca node para upload de arquivos
const multer = require('multer');

//Salva o aquivo de upload na pasta upload e renomeia
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, 'crypt-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// rota padrão para quando acessa o localhost:5000 
routes.get('/', function (req, res) {
    return res.render("index")
});

// rota para o post do localhost:5000
routes.post('/', upload.single('fileupload'), function (req, res, next) {
    let { filename } = req.file;

    let dataBuffer = fs.readFileSync("./uploads/" + filename);

    // função assíncrona para o valor ser retornado somente quando o texto do pdf for extraído e movido para a const text
    async function read_pdf() {
        const text = await pdf(dataBuffer).then(function (data) {
            return (data.text);
        })

        const cryptr = new Cryptr('senha_secreta');
        const encryptedString = cryptr.encrypt(text)
        const decryptedString = cryptr.decrypt(encryptedString);

        return res.send(`PDF Criptografado:\n\n${encryptedString}\nPDF Original:\n\n${decryptedString}` );
    }
    
    read_pdf();
});

module.exports = routes;