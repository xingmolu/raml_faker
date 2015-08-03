/**
 * raml_faker mocker main file
 */

'use strict'
var path = require('path'),
	fs = require('fs'),
	async = require('async'),
	raml = require('raml-parser'),
	_ = require('lodash'),
	schemaMocker = require('./src/schema'),
	RequestMocker = require('./src/requestMocker');



module.exports = {
    generate: generate
};

function generate(options, callback) {

	var formats = {};

	if (options) {
		if(options.formats) {
			formats = options.formats;
		}

		if (!callback || !_.isFunction(callback)) {
			console.error('必须指定一个回调函数');
		}

		try {
			// 传递的是路径
			if (options.path){

				generateFromPath( options.path, formats, callback);

			} else if (options.files && _.isArray(options.files)) { // 传递的是多个文件组成的数组

					generateFromFiles(options.files, formats, callback);
				}

			} catch (exception) {

				console.error("运行时错误， 请仔细检查参数");

			}

		}else {
			console.error('必须指定options来指定需要mock的raml');
		}
	};



	// 根据路径夺取对应的raml
	// 
	function generateFromPath(filesPath, formats, callback) {
	    fs.readdir(filesPath, function (err, files) {
	        if (err) {
	            throw err;
	        }
	        var filesToGenerate = [];
	        _.each(files, function (file) {
	            if (file.substr(-5) === '.raml') {
	                filesToGenerate.push(path.join(filesPath, file));
	            }
	        });
	        generateFromFiles(filesToGenerate, formats, callback);
	    });
	};


	// 根据文件读取raml, 并且解析为js object，
	// 
	function generateFromFiles(files, formats, callback) {
	    var requestsToMock = [];
	    async.each(files, function (file, cb) {
	        raml.loadFile(file).then(function (data) {
	            getRamlRequestsToMock(data, '/', formats, function (reqs) {
	                requestsToMock = _.union(requestsToMock, reqs);
	                cb();
	            });
	        }, function (error) {
	            cb('Error parsing: ' + error);
	        });
	    }, function (err) {
	        if (err) {
	            console.log(err);
	        } else {
	            callback(requestsToMock);
	        }
	    });
	};

	// 把raml的相关内容转化为mock
	// 
	function getRamlRequestsToMock(definition, uri, formats, callback) {
	    var requestsToMock = [];
	    if (definition.relativeUri) {
	        var nodeURI = definition.relativeUri;
	        if (definition.uriParameters) {
	            _.each(definition.uriParameters, function (uriParam, name) {
	                nodeURI = nodeURI.replace('{' + name + '}', ':' + name);
	            });
	        }
	        uri = (uri + '/' + nodeURI).replace(/\/{2,}/g, '/');
	    }
	    var tasks = [];
	    if (definition.methods) {
	        tasks.push(function (cb) {
	            getRamlRequestsToMockMethods(definition, uri, formats, function (reqs) {
	                requestsToMock = _.union(requestsToMock, reqs);
	                cb();
	            });
	        });
	    }
	    if (definition.resources) {
	        tasks.push(function (cb) {
	            getRamlRequestsToMockResources(definition, uri, formats, function (reqs) {
	                requestsToMock = _.union(requestsToMock, reqs);
	                cb();
	            });
	        });
	    }
	    async.parallel(tasks, function (err) {
	        if (err) {
	            console.log(err);
	        }
	        callback(requestsToMock);
	    });
	};


	// 获取raml的api请求方式
	function getRamlRequestsToMockMethods(definition, uri, formats, callback) {
	    var responsesByCode = [];
	    _.each(definition.methods, function (method) {
	        if (method.method && /get|post|put|delete/i.test(method.method) && method.responses) {
	            var responsesMethodByCode = getResponsesByCode(method.responses);

	            var methodMocker = new RequestMocker(uri, method.method);

	            var currentMockDefaultCode = null;
	            _.each(responsesMethodByCode, function (reqDefinition) {
	                methodMocker.addResponse(reqDefinition.code, function () {
	                    if (reqDefinition.schema) {
	                        return schemaMocker(reqDefinition.schema, formats);
	                    } else {
	                        return null;
	                    }
	                }, function () {
	                    return reqDefinition.example;
	                });
	                if ((!currentMockDefaultCode || currentMockDefaultCode > reqDefinition.code) && /^2\d\d$/.test(reqDefinition.code)) {
	                    methodMocker.mock = methodMocker.getResponses()[reqDefinition.code];
	                    methodMocker.example = methodMocker.getExamples()[reqDefinition.code];
	                    currentMockDefaultCode = reqDefinition.code;
	                }
	            });
	            if (currentMockDefaultCode) {
	                methodMocker.defaultCode = currentMockDefaultCode;
	            }
	            responsesByCode.push(methodMocker);
	        }
	    });
	    callback(responsesByCode);
	}


	// 通过返回的code
	// 
	function getResponsesByCode(responses) {
	    var responsesByCode = [];
	    _.each(responses, function (response, code) {
	        if (!response) return;
	        var body = response.body && response.body['application/json'];
	        if (response.body && response.body['application/hal+json']) {
	            body = response.body['application/hal+json'];
	        }
	        var schema = null;
	        var example = null;
	        if (!_.isNaN(Number(code)) && body) {
	            code = Number(code);
	            example = body.example;
	            try {
	                schema = body.schema && JSON.parse(body.schema);
	            } catch (exception) {
	                console.log(exception.stack);
	            }
	            responsesByCode.push({
	                code: code,
	                schema: schema,
	                example: example
	            });
	        }
	    });
	    return responsesByCode;
	};


	// 获取请求的API资源
	function getRamlRequestsToMockResources(definition, uri, formats, callback) {
	    var requestsToMock = [];
	    async.each(definition.resources, function (def, cb) {
	        getRamlRequestsToMock(def, uri, formats, function (reqs) {
	            requestsToMock = _.union(requestsToMock, reqs);
	            cb(null);
	        });
	    }, function (err) {
	        if (err) {
	            console.log(err);
	        }
	        callback(requestsToMock);
	    });
	}
