## Image Search Abstraction Layer

* User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
* User Story: I can paginate through the responses by adding a ?offset=2 parameter to the URL.
* User Story: I can get a list of the most recently submitted search strings.


## Usage

* Search for images: https://image-search-ls.herokuapp.com/api/imagesearch/[SEARCH_TERM]?offset=[NUMBER_OF_RESULTS]
* Browse recent search queries: https://image-search-ls.herokuapp.com/api/latest/imagesearch


### Stack

* Express 
* Handlebars  
* axios  
* mongoose

* Searching with Google CSE