// Create web server and listen on port 8080
// 1. Import the http module
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var comments = require('./comments.json');
var path = require('path');
var mime = require('mime');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var server = http.createServer(app);

var publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/comments', function(req, res){
  res.json(comments);
});

app.post('/comments', function(req, res){
  var comment = req.body;
  comment.id = Date.now();
  comments.push(comment);
  res.json(comment);
});

app.get('/comments/:id', function(req, res){
  var comment = comments.filter(function(comment){
    return comment.id == req.params.id;
  })[0];
  res.json(comment);
});

app.put('/comments/:id', function(req, res){
  var newComment = req.body;
  if(newComment.id){
    var comment = comments.filter(function(comment){
      return comment.id == newComment.id;
    })[0];
    if(comment){
      comment.author = newComment.author;
      comment.text = newComment.text;
      res.json(comment);
    } else {
      res.status(500).json({error: 'comment not found'});
    }
  } else {
    res.status(500).json({error: 'invalid comment'});
  }
});

app.delete('/comments/:id', function(req, res){
  var index = -1;
  for(var i=0; i<comments.length; i++){
    if(comments[i].id == req.params.id){
      index = i;
    }
  }
  if(index != -1){
    comments.splice(index, 1);
    res.json(req.params.id);
  } else {
    res.status(500).json({error: 'comment not found'});
  }
});

app.get('*', function(req, res){
  res.sendFile(path.join(publicPath, 'index.html'));
});

server.listen(8080, function(){
  console.log('listening on port 8080');
});