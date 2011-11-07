var ElementType = require("./ElementType.js");

function DefaultHandler(callback, options){
	this.dom = [];
	this._done = false;
	this._inSpecialTag = false;
	this._tagStack = [];
	if(options){ //otherwise, the prototype is used
		this._options = options;
		if(typeof this._options.verbose === "undefined")
			this._options.verbose = true;
		if (typeof this._options.enforceEmptyTags === "undefined")
			this._options.enforceEmptyTags = true;
	}
	this._callback = callback;
}

//default options
DefaultHandler.prototype._options = {
	ignoreWhitespace: false,	//Keep whitespace-only text nodes
    verbose: true,				//Keep data property for tags and raw property for all
    enforceEmptyTags: true		//Don't allow children for HTML tags defined as empty in spec
};

//HTML Tags that shouldn't contain child nodes
var emptyTags={area:true,base:true,basefont:true,br:true,col:true,frame:true,hr:true,img:true,input:true,isindex:true,link:true,meta:true,param:true,embed:true};

//**Public**//
//Methods//
//Resets the handler back to starting state
DefaultHandler.prototype.reset = function() {
	DefaultHandler.call(this, this._callback);
};
//Signals the handler that parsing is done
DefaultHandler.prototype.done = function() {
	this._done = true;
	this.handleCallback(null);
};

//Methods//
DefaultHandler.prototype.error =
DefaultHandler.prototype.handleCallback = function(error){
		if(typeof this._callback === "function")
			this._callback(error, this.dom);
		else if(error) throw error;
};

DefaultHandler.prototype._isEmptyTag = function(name) {
	return this._options.enforceEmptyTags && emptyTags[name];
};

DefaultHandler.prototype.closeTag = function(name){
	//Ignore closing tags that obviously don't have an opening tag
	if(!this._tagStack || this._isEmptyTag(name)) return;
	
	var pos = this._tagStack.length - 1;
	while(pos !== -1 && this._tagStack[pos--].name !== name){}
	if (pos !== -1 || this._tagStack[0].name === name)
	    this._tagStack.splice(pos+1);
};

DefaultHandler.prototype._addDomElement = function(element){
	if(!this._options.verbose) delete element.raw;
	
	var lastTag = this._tagStack[this._tagStack.length-1], lastChild;
	if(!lastTag) this.dom.push(element);
	else{ //There are parent elements
		if(!lastTag.children){
			lastTag.children = [element];
			return;
		}
		lastChild = lastTag.children[lastTag.children.length-1];
		if(element.type === ElementType.Comment && lastChild.type === ElementType.Comment){
			lastChild.data += element.data;
			if(this._options.verbose) lastChild.raw = lastChild.data;
		}
		else if(this._inSpecialTag && element.type === ElementType.Text && lastChild.type === ElementType.Text){
			lastChild.data += element.data;
		    if(this._options.verbose)
				lastChild.raw = lastChild.data;
		}
		else lastTag.children.push(element);
	}
};

DefaultHandler.prototype.openTag = function(element){
	if(!this._options.verbose) delete element.data;
	
	var isSpecial = element.type === ElementType.Script || element.type === ElementType.Style;
	
	if(isSpecial) this._inSpecialTag = true;
	
	this._addDomElement(element);
	
	//Don't add tags to the tag stack that can't have children
	if(!this._isEmptyTag(element.name)) this._tagStack.push(element);
};

DefaultHandler.prototype.writeText = function(element){
	if(this._options.ignoreWhitespace && element.data.trim() === "") return;
	this._addDomElement(element);
};

DefaultHandler.prototype.writeComment = DefaultHandler.prototype.writeDirective = DefaultHandler.prototype._addDomElement;

module.exports = DefaultHandler;