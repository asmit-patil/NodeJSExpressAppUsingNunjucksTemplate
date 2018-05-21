var express = require('express')
var app = express()
var nunjucks  = require('nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express   : app
  });
  
  app.set('view engine', 'html');
app.get('/', function(req, res) {
    // render to views/index.ejs template file
    res.render('index', {title: 'My Node.js CRUD demo Application with Nunjucks Templating'})
})
 
app.use('/public', express.static('public'))
/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;


