const express = require('express');
const hbs = require('hbs');
const axios = require('axios');

const keys = require('./keys');

const PORT = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

var queriesLog = [];

queryLogger = (req, res, next) => {
  var now = new Date().toUTCString();
  var log = {   
    term:`${req.params.searchString}`,
    when:`${now}`
  };  
  console.log(log);
  queriesLog.push(log);
  //console.log(queriesLog);  
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

  var searchFor = encodeURIComponent(req.params.searchString);
  //console.log('searchFor:' ,searchFor);
  var offset = req.query.offset || 10;
  //console.log('offset:', offset);
  var url = `https://www.googleapis.com/customsearch/v1?cx=${keys.CX}&key=${keys.KEY}&q=${searchFor}&searchType=image&num=${offset}`;
  console.log('url:', url);
  
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

// /api/latest/imagesearch/ route, responds with latest search queries log
app.get('/api/latest/imagesearch/', (req, res) => {
  if (queriesLog) {
    res.send(queriesLog);
  } else {
    res.send('this is the latest search queries logger page');
  }	
});


app.listen(PORT, process.env.IP, () => {
	console.log(`Server started on port ${PORT}.`);
});

