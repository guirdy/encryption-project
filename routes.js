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
        
        if(req.body.btn_crypto == 'encrypt') {
            
            // extração do texto do pdf para a variável text
            let text = await pdf(dataBuffer).then(function (data) {
                return (data.text);
            })

            function Cript() {
                let dados = text;
                let textCrypt = '';
                let len;
                let p = 0;
                let i;

                for (i = 0; i < dados.length; i++) {
                    p++;
                    len = (Asc(dados.substr(i, 1))) + (Asc(chave.substr(p, 1)));
                    if(p == 50) {
                        p = 1;
                    }
                    if(len > 255) {
                        len -= 256;
                    }
                    textCrypt += (Chr(len));
                }
                return textCrypt;
            }

            let encryptedString = Cript();

            // aqui é definido o conteúdo do pdf 
            let documentDefinition = {
                // dentro da content fica a parte de texto a ser inserido
                content: [                  
                    encryptedString
                ]
            };
            
            // o pdf é criado a partir daquele conteúdo definido
            const pdfDoc = pdfMake.createPdf(documentDefinition);

            // começa a passar pro browser para ser baixado
            pdfDoc.getBase64((data) => {
                res.writeHead(200,
                    {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment;filename="encrypted.pdf"`
                    });
                    
                    const download = Buffer.from(data.toString('utf-8'), 'base64');
                    res.end(download);
                });

        } else {

            let text = await pdf(dataBuffer).then(function (data) {
                return (data.text);
            })

            function Decript() {
                let dados = text;
                let textCrypt = '';
                let len;
                let p = 0;
                let i;

                for (i = 0; i < dados.length; i++) {
                    p++;
                    len = (Asc(dados.substr(i, 1))) - (Asc(chave.substr(p, 1)));
                    if(p == 50) {
                        p = 1;
                    }
                    if(len < 0) {
                        len += 256;
                    }
                    textCrypt += (Chr(len));
                }
                return textCrypt;
            }

            let decryptedString = Decript();

            let documentDefinition = {

                content: [
                    decryptedString
                ]
            };

            const pdfDoc = pdfMake.createPdf(documentDefinition);

            pdfDoc.getBase64((data) => {
                res.writeHead(200,
                    {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment;filename="decrypted.pdf"`
                    });
                    
                    const download = Buffer.from(data.toString('utf-8'), 'base64');
                    res.end(download);
                });
        }

    }
  
    createPdf();
});

function Asc(String){
    return String.charCodeAt(0);
}
 
function Chr(Ascii){
    return String.fromCharCode(Ascii)
}

module.exports = routes;
