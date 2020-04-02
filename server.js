const express = require('express');
const nunjucks = require('nunjucks');

// arquivo separado para rotas para deixar a visualização mais fácil
const routes = require('./routes');

const server = express();

// configuraçãao necessária para poder acessar as requisições do body e dos parâmentros passados
server.use(express.urlencoded( { extended: true } ))

server.use(express.static("public"));

// servidor vai usar as rotas do arquivo de routes
server.use(routes);

server.listen(5000, function(){
    console.log("server is running");
})