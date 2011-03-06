(function () {

function runAsModule () {
	return(
		(typeof require) == "function"
		&&
		(typeof exports) == "object"
		&&
		(typeof module) == "object"
		);
}

if (!runAsModule()) {
	if (!this.Tautologistics)
		this.Tautologistics = {};
	if (!this.Tautologistics.NodeHtmlParser)
		this.Tautologistics.NodeHtmlParser = {};
	if (!this.Tautologistics.NodeHtmlParser.Tests)
		this.Tautologistics.NodeHtmlParser.Tests = [];
	exports = {};
	this.Tautologistics.NodeHtmlParser.Tests.push(exports);
}

exports.name = "Basic test";
exports.options = {
	  handler: {}
	, parser: {}
};
exports.html = "<html><title>The Title</title><body>Hello world</body></html>";
exports.expected =
	[ { raw: 'html'
		  , data: 'html'
		  , type: 'tag'
		  , name: 'html'
		  , children: 
		     [ { raw: 'title'
		       , data: 'title'
		       , type: 'tag'
		       , name: 'title'
		       , children: [ { raw: 'The Title', data: 'The Title', type: 'text' } ]
		       }
		     , { raw: 'body'
		       , data: 'body'
		       , type: 'tag'
		       , name: 'body'
		       , children: 
		          [ { raw: 'Hello world'
		            , data: 'Hello world'
		            , type: 'text'
		            }
		          ]
		       }
		     ]
		  }
		];

})();
