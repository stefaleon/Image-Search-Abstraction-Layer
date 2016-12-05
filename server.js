const express = require('express');
const hbs = require('hbs');
const axios = require('axios');

//const keys = require('./keys');

const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
const SearchedTerm = require('./models/searchedTerm');
const dbURL = process.env.dbURL || 'mongodb://localhost/searchedterms';

mongoose.connect(dbURL);

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));


// middleware that logs searched terms and saves to db
var queryLogger = (req, res, next) => {
  var now = new Date().toISOString();
  var log = {   
    term:`${req.params.searchString}`,
    when:`${now}`
  };  
  console.log('Current log ' + JSON.stringify(log) + ' is being added to db.');
  SearchedTerm.create(log);  
  next();
};

// main route, renders usage.hbs
app.get('/', (req, res) => {
	res.render('usage', {pageTitle: 'Usage'});
});

// about route, renders about.hbs
app.get('/about', (req, res) => {
	res.render('about', {
		pageTitle: 'Image Search Abstraction Layer'		
	});
});

// api/imagesearch/:SEARCH_TERM route, responds with search results array of json objects
app.get('/api/imagesearch/:searchString', queryLogger, (req, res) => {

  // search term
  var searchFor = encodeURIComponent(req.params.searchString);
  //console.log('searchFor:' ,searchFor);
  // number of results 
  var offset = req.query.offset || 10;
  //console.log('offset:', offset);
  // make the url for the Google CSE, cx is the search engine ID, key is the Google API key
  const CX = process.env.CX; //|| keys.CX;
  const KEY = process.env.KEY; //|| keys.KEY;
  var url = `https://www.googleapis.com/customsearch/v1?cx=${CX}&key=${KEY}&q=${searchFor}&searchType=image&num=${offset}`;
  console.log('url:', url);
  
  // get data from api
  var data = {};
  axios.get(url).then((response) => {
    //console.log('response:', response);
    //console.log('response.data.items:', response.data.items);
    var outArr = [];
    response.data.items.forEach((item) => {
      outArr.push({  
        url: item.link,
        snippet: item.snippet,
        thumbnail: item.image.thumbnailLink,
        context: item.image.contextLink
      });
    });     
    res.send(outArr);
  }).catch((err) => {
    console.log(err.message);
    res.send('Could not retrieve data for this query.')
  });

});

// /api/latest/imagesearch/ route, responds with latest search queries log from db
app.get('/api/latest/imagesearch/', (req, res) => {

  SearchedTerm.find({}).sort('-when').limit(10).exec((err, foundSearchedTerms) => {
    if (err) {
      throw err;    
    } else if (foundSearchedTerms) {
      console.log('found searchedterms:', foundSearchedTerms);     
      outArr = [];
      foundSearchedTerms.forEach((element) => {
        var outputElement = {term: element.term, when: element.when};
        outArr.push(outputElement);
      });
      res.send(outArr);  
    } else {
      res.status(404).send("Not found."); 
    }       
  });   

});


app.listen(PORT, process.env.IP, () => {
	console.log(`Server started on port ${PORT}.`);
});

