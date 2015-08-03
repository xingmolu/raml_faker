var ramlFasker = require('../index');

console.log(ramlFasker);

var options = {
	path: 'raml'
};

ramlFasker.generate(options, function (requestsToMock) {
	console.log(requestsToMock);
});