const express = require('express');
const routes = express.Router();
const crypto = require('./crypto');

//Biblioteca node para upload de arquivos
const multer = require('multer');

//Salva o aquivo de upload na pasta upload e renomeia
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, 'crypt-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// rota padrão para quando acessa o localhost:5000 
routes.get('/', function(req, res){
    return res.render("index")
});

// rota para o post do localhost:5000
routes.post('/', /*crypto.post,*/ upload.single('fileupload'), function(req, res, next){
    console.log(req.file);
});

module.exports = routes;