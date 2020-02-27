const express = require('express');
const routes = express.Router();

const crypto = require('./crypto')

// rota padrão para quando acessa o localhost:5000 
routes.get('/', function(req, res){
    return res.render("index")
});

// rota para o post do localhost:5000
routes.post('/', crypto.post);

module.exports = routes;