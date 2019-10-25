var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/slickDeals"
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");


var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);
// mongoose.connect("mongodb://localhost/slickDeals", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);



app.get("/scrape", function(req,res){
    axios.get("https://slickdeals.net/").then(function (resp) {
    var $ = cheerio.load(resp.data);
    var results = {};
    $("div.itemImageLink").each(function (i, element) {
        // var title = $(element).find("img").attr("title");
        // var img = $(element).find("img").attr("data-original");
        // var link =("https://slickdeals.net" + $(element).find("a").next().attr("href")) ;
        // if (title !== undefined && img !== undefined) {
            results.title = $(this)
            .find("img")
            .attr("title");
            results.img = $(this)
            .find("img")
            .attr("data-original");
            results.link = $(this)            
            .find("a")
            .next()
            .attr("href")
        // }
        db.Article.create(results)
        .then(function(data){
            console.log(data);
            
        })
        .catch(function(err){
            console.log(err);
            
        });
    });
    res.send("Scrape Complete")
});

});
app.get("/deals", function(req, res) {
       db.Article.find({}, function(err,data){
      res.json(data)
    })
  });
  app.get("/deals/:id", function(req,res){
      db.Article.findOne({_id:req.params.id})
      .populate('note')
      .then(function(data){
          res.json(data)
      })
  });
  app.post("/deals/:id", function(req,res){
      db.Note.create(req.body)
      .then(function(data){
          return db.Article.findOneAndUpdate({_id: req.params.id},{note: data._id}, {new: true})
      }).then(function(data){
          res.json(data);
      })
  });
  app.get("/delete/:id", function(req, res){
      db.Article.deleteOne({_id:req.params.id}, function(err, removed){
          console.log(removed);
          res.send(removed);
         
          
      })
  })

app.listen(process.env.PORT || 3000, function() {
    console.log("App running on port 3000!");
  });