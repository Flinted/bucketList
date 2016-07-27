var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var ObjectID = mongodb.ObjectID;
var path = require('path');

app.use(bodyParser.json());
app.use(express.static('client/build'));
var url = 'mongodb://localhost:27017/bucketList';
 
app.get("/", function(req,res){
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
    })

//create
app.post("/bucketlist", function(req,res){
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('state');
    collection.insert(req.body);
    res.status(200).end();
    db.close();
  })
})   

app.get("/bucketlist", function(req,res){
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('state');
    collection.find({}).toArray(function(err, docs){
      res.json(docs);
      db.close();
    })
  })
})

// app.put("/animals/:id", function(req,res){
//   MongoClient.connect(url, function(err, db){
//     var collection = db.collection('animals');
//     collection.updateOne({_id: new ObjectID(req.params.id)}, {$set: {name: req.body.name, type: req.body.type, age: req.body.age}})
//     res.status(200).end();
//     db.close();
//   })
// })

  app.delete("/bucketlist/:id", function(req,res){
    MongoClient.connect(url, function(err, db){
      var collection = db.collection('state');
      collection.remove({_id: new ObjectID(req.params.id)})
      res.status(200).end();
      db.close();
    })
})

app.listen('3000', function(){
  console.log("run run running on 3000");
})