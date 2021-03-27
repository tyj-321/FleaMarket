const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
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
 
 var allUserData;
 var allGroundData;

// 获取用户数据
 app.get('/getUserInfo',function(req,res){           //配置接口api
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("用户数据库已连接!");
    var dbName = db.db("Flea-Market");
    dbName.collection("User").find({}).toArray(function(err, res){
      if (err) throw err;
      allUserData = res;
      db.close();
    });
  });
    res.status(200);
    res.json(allUserData);
});

// 注册用户时添加数据
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

 // 获取跳蚤广场数据
 app.get('/getGroundInfo',function(req,res){           //配置接口api
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("数据库已连接!");
    var dbName = db.db("Flea-Market");
    dbName.collection("Ground").find({}).toArray(function(err, res){
      if (err) throw err;
      allGroundData = res;
      db.close();
    });
  });
    res.status(200);
    res.json(allGroundData);
});

 // 注册广场数据
 app.post('/groudRegister', function(req, res) {
    var newobj = req.body;
    console.log(req.body);
    MongoClient.connect(url, function(err,db){
      if (err) throw err;
      console.log("广场数据库已经连接!");
      var dbName = db.db("Flea-Market");
      dbName.collection("Ground").insertOne(newobj, function(err, res){
        if (err) throw err;
        console.log("向广场数据库中插入数据成功");
        db.close();
      });
    });
    res.status(200);
    res.json("post successfully");
});

 // 评论新增
 app.post('/commentUpdate', function(req, res) {
    var where = {
      "_id": ObjectId(req.body.id)
    };
    console.log(where);
    var newComment = {
      "comment": req.body.comment
    };
    console.log(newComment);
    MongoClient.connect(url, function(err,db){
      if (err) throw err;
      console.log("数据库已经连接!");
      var dbName = db.db("Flea-Market");
      dbName.collection("Ground").updateOne(where, {$push:newComment}, function(err, res){
        if (err) throw err;
        console.log("向数据库中更新评论数据成功");
        db.close();
      });
    });
    res.status(200);
    res.json("comment update successfully");
});

 // 购物车新增
 app.post('/shopcarUpdate', function(req, res) {
    var where = {
      "user.id": req.body.id
    };
    console.log(where);
    var newShopcar = {
      "shopcar": req.body.shopcar
    };
    console.log(newShopcar);
    MongoClient.connect(url, function(err,db){
      if (err) throw err;
      console.log("数据库已经连接!");
      var dbName = db.db("Flea-Market");
      dbName.collection("User").updateOne(where, {$push:newShopcar}, function(err, res){
        if (err) throw err;
        console.log("向数据库中更新购物车数据成功");
        db.close();
      });
    });
    res.status(200);
    res.json("shopcar update successfully");
});

 // 购物车删除
 app.post('/shopcarDelete', function(req, res) {
    var where = {
      "user.id": req.body.id
    };
    console.log(where);
    var deleteShopcar = {
      "shopcar": req.body.shopcar
    };
    console.log(deleteShopcar);
    console.log(deleteShopcar.shopcar.length);
    MongoClient.connect(url, function(err,db){
      if (err) throw err;
      console.log("数据库已经连接!");
      var dbName = db.db("Flea-Market");
      for(let i = deleteShopcar.shopcar.length-1;i>=0;i--){
          dbName.collection("User").updateOne(where, {$pull:{"shopcar":deleteShopcar.shopcar[i]}}, function(err, res){
          if (err) throw err;
          console.log("向数据库中删除购物车数据成功");
        });
      }
      db.close();
    });
    res.status(200);
    res.json("shopcar delete successfully");
});

 // 消费历史新增
 app.post('/historyUpdate', function(req, res) {
    var where = {
      "user.id": req.body.id
    };
    console.log(where);
    var newHistory = {
      "history": req.body.history
    };
    console.log(newHistory);
    console.log(newHistory.history.length);
    MongoClient.connect(url, function(err,db){
      if (err) throw err;
      console.log("数据库已经连接!");
      var dbName = db.db("Flea-Market");
      for(let i = newHistory.history.length-1;i>=0;i--){
      dbName.collection("User").updateOne(where, {$push:{"history":newHistory.history[i]}}, function(err, res){
        if (err) throw err;
        console.log("向数据库中更新消费历史数据成功");
      });
    }
      db.close();
    });
    res.status(200);
    res.json("history update successfully");
});

 // 消费历史删除
 app.post('/historyDelete', function(req, res) {
    var where = {
      "user.id": req.body.id
    };
    console.log(where);
    var deleteHistory = {
      "history": req.body.history
    };
    console.log(deleteHistory);
    MongoClient.connect(url, function(err,db){
      if (err) throw err;
      console.log("数据库已经连接!");
      var dbName = db.db("Flea-Market");
        dbName.collection("User").updateOne(where, {$pull:deleteHistory}, function(err, res){
        if (err) throw err;
        console.log("向数据库中删除消费历史数据成功");
      });
      db.close();
    });
    res.status(200);
    res.json("history delete successfully");
});

// 评分新增
 app.post('/gradeUpdate', function(req, res) {
    var where = {
      "user.id": req.body.id
    };
    console.log(where);
    var newGrade = {
      "grade": req.body.grade
    };
    console.log(newGrade);
    MongoClient.connect(url, function(err,db){
      if (err) throw err;
      console.log("数据库已经连接!");
      var dbName = db.db("Flea-Market");
      dbName.collection("User").updateOne(where, {$push:{"grade":newGrade.grade}}, function(err, res){
        if (err) throw err;
        console.log("向数据库中更新消费历史数据成功");
      });
      db.close();
    });
    res.status(200);
    res.json("grade update successfully");
});

 //配置服务端口
var server = app.listen(5502,function(){
    console.log('listen at http://localhost:5502');
})