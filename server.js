const express = require('express');
const nunjucks = require('nunjucks')

const server = express();

server.use(express.static("public"));

server.set("view engine", "njk");

nunjucks.configure("views", {
    express: server, 
    autoescape: false,
    noCache: true
});

server.get("/", function(req, res){
    res.render("index")
})

server.listen(5000, function(){
    console.log("server is running");
})