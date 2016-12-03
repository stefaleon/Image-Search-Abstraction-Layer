const mongoose = require('mongoose');

const searchedTermsSchema = new mongoose.Schema({
	term: String,
	when: String
});

const searchedTerm = mongoose.model('searchedTerm', searchedTermsSchema);

module.exports = searchedTerm;