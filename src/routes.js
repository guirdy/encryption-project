const express = require('express');
const { createFile, sendFile } = require('./index')

const routes = express.Router();

// rota padrão para quando acessa o localhost:5000 
routes.get('/', sendFile);

// rota para o post do localhost:5000
routes.post('/', createFile);

module.exports = routes;
