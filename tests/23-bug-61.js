(function () {

function RunningInNode () {
	return(
		(typeof require) == "function"
		&&
		(typeof exports) == "object"
		&&
		(typeof module) == "object"
		&&
		(typeof __filename) == "string"
		&&
		(typeof __dirname) == "string"
		);
}

if (!RunningInNode()) {
	if (!this.Tautologistics)
		this.Tautologistics = {};
	if (!this.Tautologistics.NodeHtmlParser)
		this.Tautologistics.NodeHtmlParser = {};
	if (!this.Tautologistics.NodeHtmlParser.Tests)
		this.Tautologistics.NodeHtmlParser.Tests = [];
	exports = {};
	this.Tautologistics.NodeHtmlParser.Tests.push(exports);
}

exports.name = "Bug 61";
exports.options = {
	  handler: {}
	, parser: {}
};
exports.html = new Array(300000).join("\t") + "<";
exports.chunkSize = 500;
exports.expected =
	[ { raw: exports.html.substr(0,exports.html.length-1)
		  , data: exports.html.substr(0,exports.html.length-1)
		  , type: 'text'
	  }
	];

})();
