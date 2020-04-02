const fs = require('fs');
const formidable = require('formidable');

function cesar(text, deslocamento, criptografar) {
    const tamAscii = 256;
    let cifra = "";
    if (!criptografar) {
        deslocamento *= -1;
    }
    for (let letra of text) {
        cifra += String.fromCharCode(((letra.charCodeAt(0) + deslocamento) % tamAscii))
    }
    return cifra;
}

module.exports = {
    createFile(req, res) {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            
            const path = files.filetoupload.path;

            // leitura do arquivo
            fs.readFile(path, 'utf8', function (err, data) {
                if (err) {
                    console.error('Could not open file: %s', err)
                    process.exit(1)
                }

                let encryptedString = cesar(data, 5, fields.btn_crypto == 'encrypt')
                //Headers do arquivo txt
                res.writeHead(200,
                    {
                        'Content-Type': 'text/plain',
                        'Content-Disposition': `attachment;filename="${fields.btn_crypto}.txt"`
                    });
                //Faz download do arquivo no navegador  
                const download = Buffer.from(encryptedString);
                res.end(download);
            });
        });
    },
    sendFile (req, res) {
        return res.sendFile("./index.html", { root: __dirname } );
    }
}

