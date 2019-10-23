// var express = require("express");
// var logger = require("morgan");
// var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
// var db = require("./models");

// var PORT = 3000;

// // Initialize Express
// var app = express();

// // Configure middleware

// // Use morgan logger for logging requests
// app.use(logger("dev"));
// // Parse request body as JSON
// app.use(express.urlencoded({
//     extended: true
// }));
// app.use(express.json());
// // Make public a static folder
// app.use(express.static("public"));


axios.get("https://slickdeals.net/").then(function (resp) {
    var $ = cheerio.load(resp.data);
    var results = [];
    $("div.imageContainer").each(function (i, element) {
        var title = $(element).find("img").attr("title");
        var img = $(element).find("img").attr("data-original");
        if (title !== undefined && img !== undefined) {
            results.push({
                title: title,
                img: img
            });
        }
    });
    console.log(results);
});