const express = require('express');
const hbs = require('hbs');

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
  console.log(queriesLog);  
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
  
  var data = { 
   "items": [
    {
     "kind": "customsearch#result",
     "title": "Funny Cats Compilation [Most See] Funny Cat Videos Ever Part 1 ...",
     "htmlTitle": "Funny \u003cb\u003eCats\u003c/b\u003e Compilation [Most See] Funny \u003cb\u003eCat\u003c/b\u003e Videos Ever Part 1 ...",
     "link": "https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg",
     "displayLink": "www.youtube.com",
     "snippet": "Funny Cats Compilation [Most ...",
     "htmlSnippet": "Funny \u003cb\u003eCats\u003c/b\u003e Compilation [Most ...",
     "mime": "image/jpeg",
     "image": {
      "contextLink": "https://www.youtube.com/watch?v=tntOCGkgt98",
      "height": 1200,
      "width": 1600,
      "byteSize": 136356,
      "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMnDp0nNBLHwunbh2DDIBhN_Cj9zwRPq-Hp0sB-LlSWy2ijcFs-uyD-vE",
      "thumbnailHeight": 113,
      "thumbnailWidth": 150
     }
    },
    {
     "kind": "customsearch#result",
     "title": "Saudi Cleric Says Posing for Photos With Cats Is Forbidden",
     "htmlTitle": "Saudi Cleric Says Posing for Photos With \u003cb\u003eCats\u003c/b\u003e Is Forbidden",
     "link": "http://s.newsweek.com/sites/www.newsweek.com/files/2016/05/25/saudi-arabia-cat-ban.jpg",
     "displayLink": "www.newsweek.com",
     "snippet": "... With Cats Is Forbidden",
     "htmlSnippet": "... With \u003cb\u003eCats\u003c/b\u003e Is Forbidden",
     "mime": "image/jpeg",
     "image": {
      "contextLink": "http://www.newsweek.com/saudi-cleric-coughs-hairballs-over-cat-pictures-gulf-kingdom-463356",
      "height": 2001,
      "width": 3000,
      "byteSize": 710497,
      "thumbnailLink": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQSYJ5JwQn457lR37X4kZWBpzEbUhFqxWs2duSz3lJ4sWNzGGLy48nuRK8",
      "thumbnailHeight": 100,
      "thumbnailWidth": 150
     }
    },
    {
     "kind": "customsearch#result",
     "title": "Cats scared of Cucumbers Compilation - Cats Vs Cucumbers - Funny ...",
     "htmlTitle": "\u003cb\u003eCats\u003c/b\u003e scared of Cucumbers Compilation - \u003cb\u003eCats\u003c/b\u003e Vs Cucumbers - Funny ...",
     "link": "https://i.ytimg.com/vi/cNycdfFEgBc/maxresdefault.jpg",
     "displayLink": "www.youtube.com",
     "snippet": "Cats scared of Cucumbers ...",
     "htmlSnippet": "\u003cb\u003eCats\u003c/b\u003e scared of Cucumbers ...",
     "mime": "image/jpeg",
     "image": {
      "contextLink": "https://www.youtube.com/watch?v=cNycdfFEgBc",
      "height": 720,
      "width": 1280,
      "byteSize": 142044,
      "thumbnailLink": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQIpKVlrysjWTWyDxnvCg12eSyOy2CcISl-ZyHcTmhmhp-zL78Mq7s0_4Li",
      "thumbnailHeight": 84,
      "thumbnailWidth": 150
     }
    }
   ]
  };


  var outArr = [];

  data.items.forEach((item) => {
    outArr.push({  
      url: item.link,
      snippet: item.snippet,
      thumbnail: item.image.thumbnailLink,
      context: item.image.contextLink
    });
  }); 
	
	res.send(outArr);
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


// TODO
// http request
// add mongoose