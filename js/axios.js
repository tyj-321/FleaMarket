const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/Flea-Market";

app.all('*', function(req, res, next) {             //设置跨域访问
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
 });
 
 var alldata;

 app.get('/getUserInfo',function(req,res){           //配置接口api
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("数据库已连接!");
    var dbName = db.db("Flea-Market");
    dbName.collection("User").find({}).toArray(function(err, res){
      if (err) throw err;
      alldata = res;
      db.close();
    });
  });
    res.status(200);
    res.json(alldata);
});

 app.post('/userRegister', function(req, res) {
    var newobj = req.body;
    console.log(req.body);
    MongoClient.connect(url, function(err,db){
      if (err) throw err;
      console.log("数据库已经连接!");
      var dbName = db.db("Flea-Market");
      dbName.collection("User").insertOne(newobj, function(err, res){
        if (err) throw err;
        console.log("向数据库中插入数据成功");
        db.close();
      });
    });
    res.status(200);
    res.json("post successfully");
});

 //配置服务端口
var server = app.listen(5502,function(){
    console.log('listen at http://localhost:5502');
})