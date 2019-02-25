var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var book = require('./book.model');
var Survey = require('./encuesta.model');

var app = express();
var port= 8080;
//ZWheTIS8IaqaWMUu
//mongodb+srv://camgaro:wCj6ZH34aLjEbnmE@cluster0-surhe.gcp.mongodb.net/test?retryWrites=true
//var db = 'mongodb+srv://camgaro:ZWheTIS8IaqaWMUu@cluster0-surhe.gcp.mongodb.net/test?retryWrites=true';
var db = 'mongodb://localhost/Prueba';
//var db = 'mongodb+srv://camgaro:wCj6ZH34aLjEbnmE@cluster0-surhe.gcp.mongodb.net/test?retryWrites=true';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

mongoose.connect(db, {useNewUrlParser: true})
.then(()=>{
    console.log("conected!");
}).catch(err =>{
    console.log("failed to connect",err.stack);
});

app.get('/books', function(req,res){
    book.find({}).exec(function(err,books){
        if(err){
            res.send("Error");
        }else{
            console.log(books);
            res.json(books);
        }
    });
});

app.get('/books/:id', function(req,res){
    console.log('Obteniendo libro');
    book.findOne({
        _id: req.params.id
    }).exec(function(err,bookres){
        if(err){
            res.send('Error');
        }else{
            res.json(bookres);
        }
    })
});

app.post('/books',function(req,res){
    var newBook = new book();
    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.category = req.body.category;

    newBook.save(function(err,book){
        if(err){
            res.send('Error guardando');
        }else{
            console.log(book);
            res.send(book);
        }       
    });
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

app.put('/book/:id',function(req,res){
   book.findOneAndUpdate({
       _id: req.params.id
   },{
       $set:{
           title: req.body.title, 
           author: req.body.author, 
           category: req.body.category
        }
    },{upsert:true}
   ,function(err,newBook){
        if(err){
            console.log("Error");
        }else{
            console.log(newBook);
            res.send(newBook);
        }
   });
});

app.delete('/book/:category',function(req,res){
    book.deleteMany({category: req.params.category},function(err,book){
        if(err){
            console.log("Error borrando por categoria");
        }else{
            res.send('Registros eliminados');
        }
    });
});


app.delete('/book/:category', function(req,res){
    book.findOneAndRemove({category: req.params.category},function(err,newBook){
        if(err){
            res.send('error en el borrado');
        }else{
            res.status(204);
            res.send(newBook);
        }
    });
});

app.listen(port, function(){
    console.log('app listening port '+ port);
});