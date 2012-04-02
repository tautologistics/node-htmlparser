(function () {

function runningInCommonJSEnv () {
	return(
		(typeof require) == "function"
		&&
		(typeof exports) == "object"
		&&
		(typeof module) == "object"
		);
}

if (!runningInCommonJSEnv()) {
	if (!this.Tautologistics)
		this.Tautologistics = {};
	if (!this.Tautologistics.NodeHtmlParser)
		this.Tautologistics.NodeHtmlParser = {};
	if (!this.Tautologistics.NodeHtmlParser.Tests)
		this.Tautologistics.NodeHtmlParser.Tests = [];
	exports = {};
	this.Tautologistics.NodeHtmlParser.Tests.push(exports);
}

exports.name = "Single Tag 1";
exports.options = {
	  handler: {}
	, parser: {}
};
exports.html = "<br>text</br>";
exports.expected =
	[ { raw: 'br', data: 'br', type: 'tag', name: 'br' }
	, { raw: 'text', data: 'text', type: 'text' }
	];

})();
