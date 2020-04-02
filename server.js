const express = require('express');
const bodyParser = require('body-parser');
// arquivo separado para rotas para deixar a visualização mais fácil
const routes = require('./src/routes');

const server = express();

server.use(express.static('public'));

// servidor vai usar as rotas do arquivo de routes
server.use(routes);

server.listen(5000, function(){
    console.log("server is running");
})