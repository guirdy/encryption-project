const express = require('express');
const routes = express.Router();
const Cryptr = require('cryptr');
const fs = require('fs');
const pdf = require('pdf-parse');

const createPDF = require('pdfkit'); 

//Biblioteca node para upload de arquivos
const multer = require('multer');

//Salva o aquivo de upload na pasta upload e renomeia
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        // alterei para esse nome padrão pra n lotar a pasta do servidor com vários arquivos novos
        cb(null, 'crypt-this.pdf');
    }
});

const upload = multer({ storage });

// rota padrão para quando acessa o localhost:5000 
routes.get('/', function (req, res) {
    return res.render("index")
});

// rota para donwload do arquivo
routes.get('/download', function (req, res) {
    var filePath = "./uploads/encrypted-file.pdf"; //caminho do arquivo completo
    var fileName = "encrypted-file.pdf"; // O nome padrão que o browser vai usar pra fazer download

    return res.download(filePath, fileName)
});

// rota para o post do localhost:5000
routes.post('/', upload.single('fileupload'), function (req, res) {

    // forcei o caminho pra ir direto no mesmo nome que forcei no storage
    let dataBuffer = fs.readFileSync("./uploads/crypt-this.pdf");

    // função assíncrona para o valor ser retornado somente quando o texto do pdf for extraído e movido para a const text
    async function createPdf() {
        const text = await pdf(dataBuffer).then(function (data) {
            return (data.text);
        })

        const cryptr = new Cryptr('senha_secreta');
        const encryptedString = cryptr.encrypt(text)

        // coloquei pra ele criar o arquivo no back mesmo
        const myDoc = new createPDF; 
        myDoc.pipe(fs.createWriteStream('./uploads/encrypted-file.pdf'));
        myDoc.text(encryptedString,100,100);
        myDoc.end();

        // redireciona para a rota responsável pelo download
        return res.redirect('download');
    }
    
    createPdf();
});

module.exports = routes;
