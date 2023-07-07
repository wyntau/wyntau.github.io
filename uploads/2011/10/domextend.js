/*
 *《犀利开发 jquery内核详解与实践》中的扩展dom的代码
 */
var DOMextend = function(name, fn){
	if( ! document.all)
		eval("HTMLElement.prototype." + name + " = fn");
	else{
		var _createElement = document.createElement;
		document.createElement = function(tag){
			var _elem = _createElement(tag);
			eval("_elem." + name + " = fn");
			return _elem;
		}
		var _getElementById = document.getElementById;
		document.getElementById = function(id){
			var _elem = _getElementById(id);
			eval("_elem." + name + " = fn");
			return _elem;
		}
		var _getElementsByTagName = document.getElementsByTagName;
		document.getElementsByTagName = function(tag){
			var _arr = _getElementsByTagName(tag);
			for(var _elem = 0; _elem < _arr.length; _elem ++ )
			eval("_arr[_elem]." + name + " = fn");
			return _arr;
		}
	}
};

/*
 * 通过字符串生成DOM树.
 * 借助于一个空div加上document.createDocumentFragment()方法
 * 返回 object DocumentFragment对象
 */
function createDOM(str){
	if(!str) return;
	var _wrap=document.createElement("div");
	var _dom=document.createDocumentFragment();
	_wrap.innerHTML=str;
	for(var node=_wrap.firstChild,temp=node.nextSibling;node; ){
		_dom.appendChild(node);
		node=temp;
		temp= node ? node.nextSibling : null;
	}
	_wrap=null;
	return _dom;
}

/*
 * 检测指定的类名是否存在
 * 允许同时检测多个类名.各个类名之间用一个或多个空格分隔
 * 当多个类同时存在时,返回true
 * 否则返回false
 */
DOMextend("hasClass",function(cls){
	if(!cls || typeof cls !=  "string") return this;
	var _this=this;
	if(!_this.className) return false;
	var _cls=cls.replace(/(^\s*)|(\s*$)/g,"").split(/\s+/);
	for(var i=0;i<_cls.length;i++){
		if(!_this.className.match(new RegExp('(\\s|^)' + _cls[i] + '(\\s|$)')))
		return false;
	}
	return true;
});

/*
 * 添加类名,允许添加多个类名,
 * 类名之间用一个或多个空格分隔
 * 存在的类名直接跳过
 * 返回元素本身
 */
DOMextend("addClass",function(cls){
	if(!cls) return this;
	var _arr=cls.split(/\s+/);
	for(var i=0;i< _arr.length;i++){
		if(!this.hasClass(_arr[i])){
			this.className +=" "+ _arr[i];
		}
	}
	this.className=this.className.replace(/(^\s*)|(\s*$)/g,"");
	return this;
});

/*
 * 移除某个元素的类名,允许删除多个类名
 * 多个类名之间用一个或多个空格分隔
 * 不存在的类名静默化处理
 * 返回元素本身
 */
DOMextend("removeClass",function(cls){
	if(!cls) {
	this.className="";
	return this;
	}
	var _arr=cls.split(/\s+/);
	for(var i=0;i< _arr.length;i++){
		if(this.hasClass(_arr[i])){
			var _reg = new RegExp('(\\s|^)' + _arr[i] + '(\\s|$)');
			this.className = this.className.replace(_reg,' ');
		}
	}
	this.className=this.className.replace(/(^\s*)|(\s*$)/g,"");
	return this;
});

/* 
 * 依赖于hasclass函数 允许指定多个类名
 * 当多个类名同时存在时,元素入栈
 * 返回结果数组
 */
DOMextend("getElementsByClassName",function(cls){
	if(!cls || typeof cls != "string") return this;
	var _arr=[];
	var elemlist=this.getElementsByTagName("*");
	for(var i=0;i<elemlist.length;i++){
		if(elemlist[i].hasClass(cls.replace(/(^\s*)|(\s*$)/g,""))){
			_arr.push(elemlist[i]);
		}
	}
	return _arr;
});

/*
 * 模仿jquery的toggleclass函数
 * 允许接受多个class名
 */
DOMextend("toggleClass",function(cls){
	if(!cls || typeof cls != "string") return this;
		var _cls=cls.replace(/(^\s*)|(\s*$)/g,"").split(/\s+/);
		for (var i=0;i<_cls.length;i++){
			if(this.hasClass(_cls[i])){
				this.removeClass(_cls[i]);
			}else{
				this.addClass(_cls[i]);
			}
		}
	return this;
});

/*
 * 模仿jquery的attr方法.
 * 接受对象参数或者字符串参数.
 * attr("Property","value"); 设置属性值
 * attr("Property")返回属性值
 * attr({"Property1":"value1",
		 "Property2":"value2"
		}) 接受对象参数
 */
DOMextend("attr",function(){
	if(!arguments) return this;
	var _this=this;
	if(arguments.length==2){
		_this.setAttribute(arguments[0],arguments[1]);
		return _this;
	}else if(typeof arguments[0] == "string"){
		return _this.getAttribute(arguments[0]);
	}else if(typeof arguments[0] == "object"){
		for (var name in arguments[0]){
			_this.setAttribute(name,arguments[0][name]);
		}
		return _this;
	}
});


DOMextend("fadeIn",function(){
	var _this=this;
	_this.style.opacity = 0;
	_this.style.filter = 'alpha(opacity = 0)';
	_this.style.display = 'block';
	var n = 0;
	function fadeShow(){
		if (n < 1){
			n += 0.1;
			_this.style.opacity = n;
			_this.style.filter = 'alpha(opacity = '+n*100+')';
			var setTimeId = setTimeout(fadeShow, 50);
		}else{
			_this.style.opacity = 1;
			_this.style.filter = 'alpha(opacity = 100)';
			clearTimeout(setTimeId);
		}
	}
	fadeShow();
});

DOMextend("fadeOut",function(){
	_this=this;
	_this.style.opacity = 1;
	_this.style.filter = 'alpha(opacity = 100)';
	var n = 1;
	function fadeHide(){
		if (n > 0){
			n -= 0.1;
			_this.style.opacity = n;
			_this.style.filter = 'alpha(opacity = '+n*100+')';
			var setTimeId = setTimeout(fadeHide, 50);
		}else{
			_this.style.opacity = 0;
			_this.style.filter = 'alpha(opacity = 0)';
			clearTimeout(setTimeId);
			_this.style.display = 'none';
		}
	}
	fadeHide();
});


DOMextend("append",function(elem){
	if(!elem) return this;
	var _this=this;
	if(typeof elem == "object") ;
	else if(typeof elem == "string"){
		elem=createDOM(elem);
	}
	_this.appendChild(elem);
	return _this;
});


DOMextend("appendTo",function(elem){
	var _this=this;
	elem.appendChild(_this);
	return _this;
});


DOMextend("prepend",function(elem){
	if(!elem) return this;
	var _this=this;
	if(typeof elem == "object") ;
	else if(typeof elem == "string"){
		elem=createDOM(elem);
	}
	_this.insertBefore(elem,_this.firstChild);
	return _this;
});


DOMextend("prependTo",function(elem){
	var _this=this;
	elem.insertBefore(_this,elem.firstChild);
	return _this;
});


DOMextend("after",function(elem){
	if(!elem) return this;
		var _this=this;
	if(typeof elem == "object") ;
	else if(typeof elem == "string"){
		elem=createDOM(elem);
	}
	var _parent = this.parentNode;
	if(_parent.lastChild == _this){
		_this.parentNode.appendChild(elem);
	}else{
		_this.parentNode.insertBefore(elem,_this.nextSibling);
	}
	return _this;
});


DOMextend("before",function(elem){
	if(!elem) return this;
	var _this=this;
	if(typeof elem == "object"){
	_this.parentNode.insertBefore(elem,_this);
	return _this;
	}else if(typeof elem == "string"){
		var _dom=createDOM(elem);
		_this.parentNode.insertBefore(_dom,_this);
		return _this;
	}
});


DOMextend("insertafter",function(elem){
	var _this=this;
	if(elem.parentNode.lastChild == elem){
		elem.parentNode.appendChild(_this);
	}else{
		elem.parentNode.insertBefore(_this,elem.nextSibling);
	}
	return _this;
});


DOMextend("insertbefore",function(elem){
	var _this=this;
	elem.parentNode.insertBefore(_this,elem);
	return _this;
});


DOMextend("html",function( _html){
	var _this=this;
	if(value){
		_this.innerHTML= _html;
		return _this;
	}else{
		return _this.innerHTML;
	}
});


DOMextend("text",function(s){
	var _this = this;
	if(s!=undefined){
		_this.innerHTML = s;
		return _this;
	}
	return sum(_this);
	function sum(e){
		var son = e.childNodes;
		var string = "";
		for(var i = 0; i < son.length; i ++ ){
			if(son[i].nodeType == 3){
				string += son[i].data;
			}
			if(son[i].nodeType == 1){
				string += arguments.callee(son[i]);
			}
		}
		return string;
	}
});

/*
 * clone方法.返回clone对象
 */
DOMextend("clone",function(flag){
	var _this=this;
	var _clo=_this.cloneNode(flag);
	return _clo;
});

/*
 * 模仿jquery的replacewith方法.接受DOM对象或者字符串.
 * 将字符串转化为DOM树
 * 返回被替换的DOM的对象
 *
 */
DOMextend("replaceWith",function(elem){
	if(!elem) {return this};
	var _this=this;
	if(typeof elem == "object"){
		_this.parentNode.replaceChild(elem,_this);
		return _this;
	}else if(typeof elem == "string"){
		var _dom=createDOM(elem);	
		_this.parentNode.insertBefore(_dom,_this);
		_this.parentNode.removeChild(_this);
		return _this;
	}
});

/*
 * 替换elem元素
 */
DOMextend("replace",function(elem){
	if(!elem) return this;
	var _this=this;
	elem.parentNode.replaceChild(_this,elem);
	return _this;
});

/*
 * 删除元素,并返回被删除的元素
 */
DOMextend("remove",function(){
	var _this=this;
	_this.parentNode.removeChild(_this);
	return _this;
});

/*
 * 清空所有子节点
 */
DOMextend("empty",function(){
	var _this=this;
	_this.innerHTML="";
	return _this;
});

/*
 * 使用字符串或者存在的dom,或者新生成的dom包围所有元素
 * 返回元素本身
 */
DOMextend("wrap",function(str){
	if(!str) return this;
	var _this=this;
	if(typeof str == "string"){
		var _wrap = createDOM(str);
	}else if(typeof str == "object"){
		var _wrap = str.cloneNode(true);
	}
	_this.parentNode.insertBefore(_wrap,_this.nextSibling);
	_this.nextSibling.appendChild(_this);//nextSibling已经变成新产生的节点了.
	return _this;
});


/*
 * 模仿jquery的wrapInner方法
 * 使用字符串或者存在的dom,或者新生成的dom包围所有子节点
 * 返回元素本身
 */
DOMextend("wrapInner",function(str){
	if(!str) return this;
	var _this=this,_inner=null;
	if(typeof str == "string"){
		_inner=createDOM(str);
	}else if(typeof str == "object"){
		_inner = str.cloneNode(true);
	}
	_this.appendChild(_inner);
	_inner=_this.lastChild;
	for(;_this.firstChild != _inner;){
		_inner.appendChild(_this.firstChild);
	}
	return _this;
});