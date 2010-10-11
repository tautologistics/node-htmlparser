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

exports.name = "Enforce empty tags";
exports.html = "<link>text</link>";
exports.expected =
	[
		  { raw: 'link', data: 'link', type: 'tag', name: 'link' }
		, { raw: 'text', data: 'text', type: 'text' }
	];

})();
