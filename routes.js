const express = require('express');
const routes = express.Router();
const Cryptr = require('cryptr');
const fs = require('fs');
const pdf = require('pdf-parse');

// nova biblioteca de criar pdfs
const pdfMake = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');

// por padrão eles usam a fonte roboto que está no vfs_fonts, aqui é a configuração pro pdfMake utilizar ela
pdfMake.vfs = vfsFonts.pdfMake.vfs; 

// compressão de strings
const lzma = require("lzma");

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

// rota para o post do localhost:5000
routes.post('/', upload.single('fileupload'), function (req, res) {

    // forcei o caminho pra ir direto no mesmo nome que forcei no storage
    let dataBuffer = fs.readFileSync("./uploads/crypt-this.pdf");

    // função assíncrona para o valor ser retornado somente quando o texto do pdf for extraído e movido para a const text
    async function createPdf() {
        // extração do texto do pdf para a variável text
        let text = await pdf(dataBuffer).then(function (data) {
            return (data.text);
        })


        const cryptr = new Cryptr('senha_secreta'); //precisamos mudar a "senha secreta"

        // é feita a criptografia da text
        let encryptedString = cryptr.encrypt(text)

        // aqui é definido o conteúdo do pdf 
        var documentDefinition = {
            // dentro da content fica a parte de texto a ser inserido,

            // da pra colocar várias coisas no vetor, é só separar por vírgula mesmo

            // por padrão, cada posição do vetor ocupa uma linha, é como se tivesse um <br> entre eles
            // porém se vc joga uma string muito grande uma posição ele se adapta e preenche certinho o pdf então n tem problema
            content: [
                // aqui é feita a compressão da criptografia
                // temos que verificar se é viável e funcional fazer essa compressão pra depois descomprimir e descriptografar
                lzma.compress(encryptedString)

                // para descriptografar seria lzmma.decompress()
            ]
        };


        
        // aqui o pdf é criado a partir daquele conteúdo definido
        const pdfDoc = pdfMake.createPdf(documentDefinition);

        // essa é a parte que ele começa a passar pro browser para ser baixado
        pdfDoc.getBase64((data) => {
            res.writeHead(200,
                {
                    'Content-Type': 'application/pdf',
                    // o encrypted.pdf é nome que ficou por padrão, mas da pra alterar pro nome que quiser 
                    'Content-Disposition': `attachment;filename="encrypted.pdf"`
                });
                
                const download = Buffer.from(data.toString('utf-8'), 'base64');
                res.end(download);
            });
        }
        
        createPdf();
});

module.exports = routes;
