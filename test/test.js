var ramlFasker = require('../index'),
	_ = require("lodash");


var options = {
	path: 'raml'
};

ramlFasker.generate(options, function (requestsToMock) {
	//console.log(requestsToMock);

	console.log(requestsToMock.length);

	_.each(requestsToMock, function(reqToMock){
		console.log('-----------------');
		console.log('uri ----->' + reqToMock.uri);

		console.log('code ----->' + reqToMock.defaultCode);

		try{
			console.log(reqToMock.mock());
		} catch (exception){
			console.log(exception.stack);
		}
		
	});
});