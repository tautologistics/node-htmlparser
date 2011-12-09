var ElementType = require("./ElementType.js");

function getTest (checkVal) {
	return function (value) { return value === checkVal; };
}

var arrayPush = Array.prototype.push;
function filterArray(test, arr, recurse, limit){
	var result = [], childs;
	
	for(var i = 0, j = arr.length; i < j; i++){
		if(test(arr[i])){
			result.push(arr[i]);
			if(--limit <= 0) break;
		}
		
		if(recurse && (childs = arr[i].children)){
			childs = filterArray(test, childs, limit);
			arrayPush.apply(result, childs);
			limit -= childs.length;
			if(limit <= 0) break;
		}
	}
	return result;
}

function filter(test, element, recurse, limit){
	if(recurse !== false) recurse = true;
	if(isNaN(limit)) limit = Infinity;
	if(!Array.isArray(element)){
		element = [element];
	}
	return filterArray(test, element, recurse, limit);
}

module.exports = {
	testElement: function testElement(options, element) {
		 var type = element.type;
	
		 for(var key in options){
		 	if(key === "tag_name"){
		 		if(type !== ElementType.Tag && type !== ElementType.Script && type !== ElementType.Style) return false;
		 		if(!options.tag_name(element.name)) return false;
		 	} else if(key === "tag_type") {
		 		if(!options.tag_type(type)) return false;
		 	} else if(key === "tag_contains") {
		 		if(type !== ElementType.Text && type !== ElementType.Comment && type !== ElementType.Directive) return false;
		 		if(!options.tag_contains(element.data)) return false;
		 	} else if(!element.attribs || !options[key](element.attribs[key]))
		 		return false;
		 }
	
		 return true;
	}, 
	
	getElements: function(options, element, recurse, limit){
		for(var key in options){
			if(typeof options[key] !== "function"){
				options[key] = getTest(options[key]);
			}
		}
		
		return filter(this.testElement.bind(null, options), element, recurse, limit);
	},

	getElementById: function(id, element, recurse) {
		var result;
		if(typeof id === "function"){
			result = filter(function(elem){
				return elem.attribs && id(elem.attribs);
			}, element, recurse, 1);
		}
		else{
			result = filter(function(elem){
				return elem.attribs && elem.attribs.id === id;
			}, element, recurse, 1);
		}
		return result.length ? result[0] : null;
	},

	getElementsByTagName: function(name, element, recurse, limit){
		if(typeof name === "function") return filter(function(elem){
			var type = elem.type;
			if(type !== ElementType.Tag && type !== ElementType.Script && type !== ElementType.Style) return false;
			return name(elem.name);
		}, element, recurse, limit);
		
		else return filter(function(elem){
			var type = elem.type;
			if(type !== ElementType.Tag && type !== ElementType.Script && type !== ElementType.Style) return false;
			return elem.name === name;
		}, element, recurse, limit);
	},

	getElementsByTagType: function(type, element, recurse, limit){
		if(typeof type === "function"){
			return filter(function(elem){return type(elem.type);}, element, recurse, limit);
		}
		else return filter(function(elem){return elem.type === type;}, element, recurse, limit);
	}
};