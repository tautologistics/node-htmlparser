var DefaultHandler = require("./DefaultHandler.js"),
	DomUtils = require("./DomUtils.js"),
	inherits = require("util").inherits;

//TODO: make this a trully streamable handler
function RssHandler(callback){
	DefaultHandler.call(this, callback, { ignoreWhitespace: true, verbose: false, enforceEmptyTags: false });
}

inherits(RssHandler, DefaultHandler);

function getElements(what, where, one, recurse){
	if(one) return DomUtils.getElementsByTagName(what, where, recurse, 1)[0];
	else	return DomUtils.getElementsByTagName(what, where, recurse);
}
function fetch(what, where, recurse){
	var ret = getElements(what, where, true, recurse);
	if(ret && (ret = ret.children) && ret.length > 0) return ret[0].data;
	else return false;
}

function fetchAll(where, recurse){
    var entry = {};
    DomUtils.getElementsByTagType("tag", where, recurse, where.length)
        .forEach(function(ret, i){
                     var name = ret.name;
                     if(ret && (ret = ret.children) && ret[0].data && ret.length > 0) 
                         entry[name] = ret[0].data;
                 });
    return entry;
}


function convertDates(feed) {
    var tmp;
    for( var i = 1; i < arguments.length; i++ ) {
        if((tmp = new Date(feed[arguments[i]]))!="Invalid Date")
            feed[arguments[i]] = tmp;
    }
    return feed;
}


var isValidFeed = function(value) {
	return value === "rss" || value === "feed" || value === "rdf:RDF";
}

RssHandler.prototype.done = function() {
	var feed = {};
	var feedRoot;
	var tmp, items, childs;

	feedRoot = getElements(isValidFeed, this.dom, true);
	if (feedRoot) {
		if(feedRoot.name === "rdf:RDF"){
			items = getElements("item", feedRoot.children);
			childs = getElements("channel", feedRoot.children, true).children;
		}
		else if(feedRoot.name === "rss"){
			childs = feedRoot.children[0].children;
			items = getElements("item", childs);
		}
		else{
			childs = feedRoot.children;
			items = getElements("entry", childs);
		}
		
		if (feedRoot.name === "feed"){
                    feed = fetchAll(childs);
		    feed.type = "atom";

		    if((tmp = getElements("link", childs, true)) && (tmp = tmp.attribs) && (tmp = tmp.href))
				feed.link = tmp;

                    feed = convertDates(feed, "modified", "updated", "dc:date");

			feed.items = Array(items.length);
			items.forEach(function(item, i){
                                var tmp,
                                entry = fetchAll(item.children);
                                entry = convertDates(entry, "modified", "issued", "pubDate");
				if((tmp = getElements("link", item.children, true)) && (tmp = tmp.attribs) && (tmp = tmp.href))
					entry.link = tmp;
				feed.items[i] = entry;
			});
		} else {
                        feed = fetchAll(childs);
			feed.type = feedRoot.name;
                        feed = convertDates(feed, "lastBuildDate");
			feed.items = Array(items.length);
			items.forEach(function(item, i){
                                var tmp,
                                entry = fetchAll(item.children);
                                entry = convertDates(entry, "pubDate", 
                                                     "dc:date", "dcterms:issued");
				feed.items[i] = entry;
			});
		}
		this.dom = feed;
	}
	DefaultHandler.prototype.handleCallback.call(this);
};

module.exports = RssHandler;
