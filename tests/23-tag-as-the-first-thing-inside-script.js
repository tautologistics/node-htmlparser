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

exports.name = "Tag as the first thing inside <script>";
exports.options = {
	  handler: {}
	, parser: {}
};
exports.html = "<head><script type=\"text/html\"><div></div></script></head>";
exports.expected =
[ { raw: 'head'
  , data: 'head'
  , type: 'tag'
  , name: 'head'
  , children:
     [ { raw: 'script type="text/html"'
       , data: 'script type="text/html"'
       , type: 'script'
       , name: 'script'
       , attribs: { type: 'text/html' }
       , children:
          [ { raw: '<div></div>'
            , data: '<div></div>'
            , type: 'text'
            }
          ]
       }
     ]
  }
];

})();
