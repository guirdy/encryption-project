const express = require('express');
const routes = express.Router();
const Cryptr = require('cryptr');
const fs = require('fs');
const pdf = require('pdf-parse');

// biblioteca de criar pdfs
const pdfMake = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');

let chave = 'abcdefghijklmnopqrstuvyxwzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// por padrão eles usam a fonte roboto que está no vfs_fonts, aqui é a configuração pro pdfMake utilizar ela
pdfMake.vfs = vfsFonts.pdfMake.vfs; 

//Biblioteca node para upload de arquivos
const multer = require('multer');

//Salva o aquivo de upload na pasta upload e renomeia
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, 'crypt-this.pdf');
    }
});

const upload = multer({ storage });

// rota padrão para quando acessa o localhost:5000 
routes.get('/', function (req, res) {
    return res.render("index")
});

// rota para o post do localhost:5000
routes.post('/', upload.single('fileupload'), function (req, res) {

    let dataBuffer = fs.readFileSync("./uploads/crypt-this.pdf");

    // função assíncrona para o valor ser retornado somente quando o texto do pdf for extraído e movido para a const text
    async function createPdf() {
        
        // req.body.btn_crypto == 'encrypt'
            
            // extração do texto do pdf para a variável text
            let text = await pdf(dataBuffer).then(function (data) {
                return (data.text);
            })

           
            const deslocamento = 5; // chave simétrica
            let encryptedString = cesar(text, deslocamento, (req.body.btn_crypto == 'encrypt'));

            // aqui é definido o conteúdo do pdf 
            let documentDefinition = {
                // dentro da content fica a parte de texto a ser inserido
                content: [                  
                    text
                ]
            };
            
            // o pdf é criado a partir daquele conteúdo definido
            const pdfDoc = await pdfMake.createPdf(documentDefinition);

            // começa a passar pro browser para ser baixado
            pdfDoc.getBase64(async (data) => {
                res.writeHead(200,
                    {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment;filename="${req.body.btn_crypto}.pdf"`
                    });
                    
                    const download = await Buffer.from(data.toString('utf-8'), 'base64');
                    res.end(download);
                });
    }
  
    createPdf();
});

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
