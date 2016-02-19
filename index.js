var express = require('express');
var expressHandlebars = require('expresss-handlebars');
var bodyParser = require('body-parser');

var Sequelize = require('sequelize');

var connection = new Sequelize('test_validation_db', 'root', 'jigganick', {
  dialect: 'mysql',
  port: 3306,
  host: 'localhost'
});

var PORT = 1738;

var app = express();

app.engine('handlebars', expressHandlebars({
  deaultLayout: 'main'
}));

app.set('view engine,' 'handlebars');
app.use(bodyParser.urlencoded({
  extended: false
}));

var Note = connection.define('note', {
  title:{
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate:{
      notEmpty: true,
      len:{
        args: [1, 10],
        msg: 'Please enter a title that is not too long and at least one character',
      }
    }
  },
  body: {
    type: Sequelize.TEXT,
    validate: {
      check: function(bodyVal) {
        if (bodyVal == "watwatwat") {
          throw new Erro('')
        }
      }
    }
  }
});

app.get('/', function(req, res) {
  Note.findALL({}).then(function(results) {
    res.render('home', {results});
  });
});

app.post('/entry', function(req, res) {
  var myTitle = req.body.title;
  var myText = req.body.text;

  Note.create({ //using squelize method to enter into database
    title: myTitle,
    body: myText
  }).then(function(result) {
    res.redirect('/success'); //directing you to a specific route
  }).catch(function(err) {
    console.log(err);
    res.redirect('/fail');
  });

  app.get('/sucess', function(req, res) {
    res.send('Success Page!');
  });

  app.get('/fail', function(req, res) {
    res.send('Fail to add entry');
  });

  connection.sync().then(function() {
    app.listen(PORT, function() {
      console.log("Listening on port")
    })
  });
});