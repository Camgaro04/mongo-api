var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Survey = require('./encuesta.model');
var question = require('./pregunta.model');


var app = express();
var port= 8080;
//ZWheTIS8IaqaWMUu
var db = 'mongodb://camgaro:ZWheTIS8IaqaWMUu@cluster0-shard-00-00-surhe.gcp.mongodb.net:27017,cluster0-shard-00-01-surhe.gcp.mongodb.net:27017,cluster0-shard-00-02-surhe.gcp.mongodb.net:27017/Encuestas?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

app.use((req,res,next) =>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Request-With,Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,OPTIONS");
    next();
  });


mongoose.connect(db, {useNewUrlParser: true})
.then(()=>{
    console.log("conected!");
}).catch(err =>{
    console.log("failed to connect",err.stack);
});

app.get('/survey',function(req,res){
    Survey.find({}).exec(function(err,surveys){
        if(err){
            res.send("Error");
        }else{
            console.log(surveys);
            res.json(surveys);
        }
    });
});

app.post('/survey',function(req,res){
    var newSurvey = new Survey();
    newSurvey.title = req.body.title;
    newSurvey.author = req.body.author;
    newSurvey.isactive = req.body.isactive;
    newSurvey.questions = req.body.questions;
    newSurvey.save(function(err,survey){
        if(err){
            console.log(err);
            res.send('Error guardando');
        }else{
            console.log(survey);
            res.send(survey);
        }   
    });
});

app.put('/survey/:id',function(req,res){
    Survey.findByIdAndUpdate({
        _id: req.params.id
    },{
        $set:{
            questions: req.body.questions
        }
    },{upsert:true},function(err,questions){
        if(err){
            console.log("Error");
        }else{
            console.log(questions);
            res.send(questions);
        }
    });
});

app.put('/surveystate/:id',function(req,res){
    Survey.findByIdAndUpdate({
        _id: req.params.id
    },{
        $set:{
            isactive: req.body.isactive
        }
    },{upsert:true},function(err,isactive){
        if(err){
            console.log("Error");
        }else{
            console.log(isactive);
            res.send(isactive);
        }
    });
});

app.delete('/survey/:id',function(req,res){
    Survey.findOneAndDelete({_id: req.params.id},function(err,survey){
        if(err){
            res.send('error en el borrado');
        }else{
            res.status(204);
            res.send(survey);
        }
    });
});

app.post('/question',function(req,res){
    var newQuestion = new question();
    newQuestion.question = req.body.question;
    newQuestion.author = req.body.author;
    newQuestion.category = req.body.category;
    newQuestion.formtype = req.body.formtype;
    newQuestion.save(function(err,newQuestion){
        if(err){
            console.log(err);
            res.send('Error guardando');
        }else{
            console.log(newQuestion);
            res.send(newQuestion);
        }   
    });
});

app.get('/questions',function(req,res){
    question.find({}).exec(function(err,question){
        if(err){
            res.send("Error");
        }else{
            console.log(question);
            res.json(question);
        }
    });
});

app.listen(port, function(){
    console.log('app listening port '+ port);
});