/* QuoJS v2.3.6 - 2013/5/13
   http://quojs.tapquo.com
   Copyright (c) 2013 Javi Jimenez Villar (@soyjavi) - Licensed MIT */
(function(){var e;e=function(){var e,t,n;t=[];e=function(t,r){var i;if(!t){return n()}else if(e.toType(t)==="function"){return e(document).ready(t)}else{i=e.getDOMObject(t,r);return n(i,t)}};n=function(e,r){e=e||t;e.__proto__=n.prototype;e.selector=r||"";return e};e.extend=function(e){Array.prototype.slice.call(arguments,1).forEach(function(t){var n,r;r=[];for(n in t){r.push(e[n]=t[n])}return r});return e};n.prototype=e.fn={};return e}();window.Quo=e;"$$"in window||(window.$$=e)}).call(this);(function(){(function(e){var t,n,r,i,u,a,o,s,c,f,l;t={TYPE:"GET",MIME:"json"};r={script:"text/javascript, application/javascript",json:"application/json",xml:"application/xml, text/xml",html:"text/html",text:"text/plain"};n=0;e.ajaxSettings={type:t.TYPE,async:true,success:{},error:{},context:null,dataType:t.MIME,headers:{},xhr:function(){return new window.XMLHttpRequest},crossDomain:false,timeout:0};e.ajax=function(n){var r,o,f,h;f=e.mix(e.ajaxSettings,n);if(f.type===t.TYPE){f.url+=e.serializeParameters(f.data,"?")}else{f.data=e.serializeParameters(f.data)}if(i(f.url)){return e.jsonp(f)}h=f.xhr();h.onreadystatechange=function(){if(h.readyState===4){clearTimeout(r);return c(h,f)}};h.open(f.type,f.url,f.async);s(h,f);if(f.timeout>0){r=setTimeout(function(){return l(h,f)},f.timeout)}try{h.send(f.data)}catch(d){o=d;h=o;a("Resource not found",h,f)}if(f.async){return h}else{return u(h,f)}};e.jsonp=function(t){var r,i,u,a;if(t.async){i="jsonp"+ ++n;u=document.createElement("script");a={abort:function(){e(u).remove();if(i in window){return window[i]={}}}};r=void 0;window[i]=function(n){clearTimeout(r);e(u).remove();delete window[i];return f(n,a,t)};u.src=t.url.replace(RegExp("=\\?"),"="+i);e("head").append(u);if(t.timeout>0){r=setTimeout(function(){return l(a,t)},t.timeout)}return a}else{return console.error("QuoJS.ajax: Unable to make jsonp synchronous call.")}};e.get=function(t,n,r,i){return e.ajax({url:t,data:n,success:r,dataType:i})};e.post=function(e,t,n,r){return o("POST",e,t,n,r)};e.put=function(e,t,n,r){return o("PUT",e,t,n,r)};e["delete"]=function(e,t,n,r){return o("DELETE",e,t,n,r)};e.json=function(n,r,i){return e.ajax({url:n,data:r,success:i,dataType:t.MIME})};e.serializeParameters=function(e,t){var n,r;if(t==null){t=""}r=t;for(n in e){if(e.hasOwnProperty(n)){if(r!==t){r+="&"}r+=""+encodeURIComponent(n)+"="+encodeURIComponent(e[n])}}if(r===t){return""}else{return r}};c=function(e,t){if(e.status>=200&&e.status<300||e.status===0){if(t.async){f(u(e,t),e,t)}}else{a("QuoJS.ajax: Unsuccesful request",e,t)}};f=function(e,t,n){n.success.call(n.context,e,t)};a=function(e,t,n){n.error.call(n.context,e,t,n)};s=function(e,t){var n;if(t.contentType){t.headers["Content-Type"]=t.contentType}if(t.dataType){t.headers["Accept"]=r[t.dataType]}for(n in t.headers){e.setRequestHeader(n,t.headers[n])}};l=function(e,t){e.onreadystatechange={};e.abort();a("QuoJS.ajax: Timeout exceeded",e,t)};o=function(t,n,r,i,u){return e.ajax({type:t,url:n,data:r,success:i,dataType:u,contentType:"application/x-www-form-urlencoded"})};u=function(e,n){var r,i;i=e.responseText;if(i){if(n.dataType===t.MIME){try{i=JSON.parse(i)}catch(u){r=u;i=r;a("QuoJS.ajax: Parse Error",e,n)}}else{if(n.dataType==="xml"){i=e.responseXML}}}return i};return i=function(e){return RegExp("=\\?").test(e)}})(Quo)}).call(this);(function(){(function(e){var t,n,r,i,u,a,o,s;t=[];i=Object.prototype;r=/^\s*<(\w+|!)[^>]*>/;u=document.createElement("table");a=document.createElement("tr");n={tr:document.createElement("tbody"),tbody:u,thead:u,tfoot:u,td:a,th:a,"*":document.createElement("div")};e.toType=function(e){return i.toString.call(e).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()};e.isOwnProperty=function(e,t){return i.hasOwnProperty.call(e,t)};e.getDOMObject=function(t,n){var i,u,a;i=null;u=[1,9,11];a=e.toType(t);if(a==="array"){i=o(t)}else if(a==="string"&&r.test(t)){i=e.fragment(t.trim(),RegExp.$1);t=null}else if(a==="string"){i=e.query(document,t);if(n){if(i.length===1){i=e.query(i[0],n)}else{i=e.map(function(){return e.query(i,n)})}}}else if(u.indexOf(t.nodeType)>=0||t===window){i=[t];t=null}return i};e.map=function(t,n){var r,i,u,a;a=[];r=void 0;i=void 0;if(e.toType(t)==="array"){r=0;while(r<t.length){u=n(t[r],r);if(u!=null){a.push(u)}r++}}else{for(i in t){u=n(t[i],i);if(u!=null){a.push(u)}}}return s(a)};e.each=function(t,n){var r,i;r=void 0;i=void 0;if(e.toType(t)==="array"){r=0;while(r<t.length){if(n.call(t[r],r,t[r])===false){return t}r++}}else{for(i in t){if(n.call(t[i],i,t[i])===false){return t}}}return t};e.mix=function(){var t,n,r,i,u;r={};t=0;i=arguments.length;while(t<i){n=arguments[t];for(u in n){if(e.isOwnProperty(n,u)&&n[u]!==undefined){r[u]=n[u]}}t++}return r};e.fragment=function(t,r){var i;if(r==null){r="*"}if(!(r in n)){r="*"}i=n[r];i.innerHTML=""+t;return e.each(Array.prototype.slice.call(i.childNodes),function(){return i.removeChild(this)})};e.fn.map=function(t){return e.map(this,function(e,n){return t.call(e,n,e)})};e.fn.instance=function(e){return this.map(function(){return this[e]})};e.fn.filter=function(t){return e([].filter.call(this,function(n){return n.parentNode&&e.query(n.parentNode,t).indexOf(n)>=0}))};e.fn.forEach=t.forEach;e.fn.indexOf=t.indexOf;o=function(e){return e.filter(function(e){return e!==void 0&&e!==null})};return s=function(e){if(e.length>0){return[].concat.apply([],e)}else{return e}}})(Quo)}).call(this);(function(){(function(e){e.fn.attr=function(t,n){if(this.length===0){null}if(e.toType(t)==="string"&&n===void 0){return this[0].getAttribute(t)}else{return this.each(function(){return this.setAttribute(t,n)})}};e.fn.removeAttr=function(e){return this.each(function(){return this.removeAttribute(e)})};e.fn.data=function(e,t){return this.attr("data-"+e,t)};e.fn.removeData=function(e){return this.removeAttr("data-"+e)};e.fn.val=function(t){if(e.toType(t)==="string"){return this.each(function(){return this.value=t})}else{if(this.length>0){return this[0].value}else{return null}}};e.fn.show=function(){return this.style("display","block")};e.fn.hide=function(){return this.style("display","none")};e.fn.height=function(){var e;e=this.offset();return e.height};e.fn.width=function(){var e;e=this.offset();return e.width};e.fn.offset=function(){var e;e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:e.width,height:e.height}};return e.fn.remove=function(){return this.each(function(){if(this.parentNode!=null){return this.parentNode.removeChild(this)}})}})(Quo)}).call(this);(function(){(function(e){var t,n,r,i,u,a,o;r=null;t=/WebKit\/([\d.]+)/;n={Android:/(Android)\s+([\d.]+)/,ipad:/(iPad).*OS\s([\d_]+)/,iphone:/(iPhone\sOS)\s([\d_]+)/,Blackberry:/(BlackBerry|BB10|Playbook).*Version\/([\d.]+)/,FirefoxOS:/(Mozilla).*Mobile[^\/]*\/([\d\.]*)/,webOS:/(webOS|hpwOS)[\s\/]([\d.]+)/};e.isMobile=function(){r=r||u();return r.isMobile&&r.os.name!=="firefoxOS"};e.environment=function(){r=r||u();return r};e.isOnline=function(){return navigator.onLine};u=function(){var e,t;t=navigator.userAgent;e={};e.browser=i(t);e.os=a(t);e.isMobile=!!e.os;e.screen=o();return e};i=function(e){var n;n=e.match(t);if(n){return n[0]}else{return e}};a=function(e){var t,r,i;t=null;for(r in n){i=e.match(n[r]);if(i){t={name:r==="iphone"||r==="ipad"?"ios":r,version:i[2].replace("_",".")};break}}return t};return o=function(){return{width:window.innerWidth,height:window.innerHeight}}})(Quo)}).call(this);(function(){(function(e){var t,n,r,i,u,a,o,s,c,f,l,h;t=1;i={};r={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};n={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",touch:"click",doubletap:"dblclick",orientationchange:"resize"};u=/complete|loaded|interactive/;e.fn.on=function(t,n,r){if(n==="undefined"||e.toType(n)==="function"){return this.bind(t,n)}else{return this.delegate(n,t,r)}};e.fn.off=function(t,n,r){if(n==="undefined"||e.toType(n)==="function"){return this.unbind(t,n)}else{return this.undelegate(n,t,r)}};e.fn.ready=function(t){if(u.test(document.readyState)){return t(e)}else{return e.fn.addEvent(document,"DOMContentLoaded",function(){return t(e)})}};e.Event=function(e,t){var n,r;n=document.createEvent("Events");n.initEvent(e,true,true,null,null,null,null,null,null,null,null,null,null,null,null);if(t){for(r in t){n[r]=t[r]}}return n};e.fn.bind=function(e,t){return this.each(function(){l(this,e,t)})};e.fn.unbind=function(e,t){return this.each(function(){h(this,e,t)})};e.fn.delegate=function(t,n,r){return this.each(function(i,u){l(u,n,r,t,function(n){return function(r){var i,o;o=e(r.target).closest(t,u).get(0);if(o){i=e.extend(a(r),{currentTarget:o,liveFired:u});return n.apply(o,[i].concat([].slice.call(arguments,1)))}}})})};e.fn.undelegate=function(e,t,n){return this.each(function(){h(this,t,n,e)})};e.fn.trigger=function(t,n,r){if(e.toType(t)==="string"){t=e.Event(t,n)}if(r!=null){t.originalEvent=r}return this.each(function(){this.dispatchEvent(t)})};e.fn.addEvent=function(e,t,n){if(e.addEventListener){return e.addEventListener(t,n,false)}else if(e.attachEvent){return e.attachEvent("on"+t,n)}else{return e["on"+t]=n}};e.fn.removeEvent=function(e,t,n){if(e.removeEventListener){return e.removeEventListener(t,n,false)}else if(e.detachEvent){return e.detachEvent("on"+t,n)}else{return e["on"+t]=null}};l=function(t,n,r,u,a){var c,l,h,d;n=s(n);h=f(t);l=i[h]||(i[h]=[]);c=a&&a(r,n);d={event:n,callback:r,selector:u,proxy:o(c,r,t),delegate:c,index:l.length};l.push(d);return e.fn.addEvent(t,d.event,d.proxy)};h=function(t,n,r,u){var a;n=s(n);a=f(t);return c(a,n,r,u).forEach(function(n){delete i[a][n.index];return e.fn.removeEvent(t,n.event,n.proxy)})};f=function(e){return e._id||(e._id=t++)};s=function(t){var r;r=e.isMobile()?t:n[t];return r||t};o=function(e,t,n){var r;t=e||t;r=function(e){var r;r=t.apply(n,[e].concat(e.data));if(r===false){e.preventDefault()}return r};return r};c=function(e,t,n,r){return(i[e]||[]).filter(function(e){return e&&(!t||e.event===t)&&(!n||e.callback===n)&&(!r||e.selector===r)})};return a=function(t){var n;n=e.extend({originalEvent:t},t);e.each(r,function(e,r){n[e]=function(){this[r]=function(){return true};return t[e].apply(t,arguments)};return n[r]=function(){return false}});return n}})(Quo)}).call(this);(function(){(function($$){var CURRENT_TOUCH,EVENT,FIRST_TOUCH,GESTURE,GESTURES,HOLD_DELAY,TAPS,TOUCH_TIMEOUT,_angle,_capturePinch,_captureRotation,_cleanGesture,_distance,_fingersPosition,_getTouches,_hold,_isSwipe,_listenTouches,_onTouchEnd,_onTouchMove,_onTouchStart,_parentIfText,_swipeDirection,_trigger;TAPS=null;EVENT=void 0;GESTURE={};FIRST_TOUCH=[];CURRENT_TOUCH=[];TOUCH_TIMEOUT=void 0;HOLD_DELAY=650;GESTURES=["touch","tap","singleTap","doubleTap","hold","swipe","swiping","swipeLeft","swipeRight","swipeUp","swipeDown","rotate","rotating","rotateLeft","rotateRight","pinch","pinching","pinchIn","pinchOut","drag","dragLeft","dragRight","dragUp","dragDown"];GESTURES.forEach(function(e){$$.fn[e]=function(t){var n;n=e==="touch"?"touchend":e;return $$(document.body).delegate(this.selector,n,t)};return this});$$(document).ready(function(){return _listenTouches()});_listenTouches=function(){var e;e=$$(document.body);e.bind("touchstart",_onTouchStart);e.bind("touchmove",_onTouchMove);e.bind("touchend",_onTouchEnd);return e.bind("touchcancel",_cleanGesture)};_onTouchStart=function(e){var t,n,r,i;EVENT=e;r=Date.now();t=r-(GESTURE.last||r);TOUCH_TIMEOUT&&clearTimeout(TOUCH_TIMEOUT);i=_getTouches(e);n=i.length;FIRST_TOUCH=_fingersPosition(i,n);GESTURE.el=$$(_parentIfText(i[0].target));GESTURE.fingers=n;GESTURE.last=r;if(!GESTURE.taps){GESTURE.taps=0}GESTURE.taps++;if(n===1){if(n>=1){GESTURE.gap=t>0&&t<=250}return setTimeout(_hold,HOLD_DELAY)}else if(n===2){GESTURE.initial_angle=parseInt(_angle(FIRST_TOUCH),10);GESTURE.initial_distance=parseInt(_distance(FIRST_TOUCH),10);GESTURE.angle_difference=0;return GESTURE.distance_difference=0}};_onTouchMove=function(e){var t,n,r;EVENT=e;if(GESTURE.el){r=_getTouches(e);t=r.length;if(t===GESTURE.fingers){CURRENT_TOUCH=_fingersPosition(r,t);n=_isSwipe(e);if(n){GESTURE.prevSwipe=true}if(n||GESTURE.prevSwipe===true){_trigger("swiping")}if(t===2){_captureRotation();_capturePinch();e.preventDefault()}}else{_cleanGesture()}}return true};_isSwipe=function(e){var t,n,r;t=false;if(CURRENT_TOUCH[0]){n=Math.abs(FIRST_TOUCH[0].x-CURRENT_TOUCH[0].x)>30;r=Math.abs(FIRST_TOUCH[0].y-CURRENT_TOUCH[0].y)>30;t=GESTURE.el&&(n||r)}return t};_onTouchEnd=function(e){var t,n,r,i,u;EVENT=e;_trigger("touch");if(GESTURE.fingers===1){if(GESTURE.taps===2&&GESTURE.gap){_trigger("doubleTap");_cleanGesture()}else if(_isSwipe()||GESTURE.prevSwipe){_trigger("swipe");u=_swipeDirection(FIRST_TOUCH[0].x,CURRENT_TOUCH[0].x,FIRST_TOUCH[0].y,CURRENT_TOUCH[0].y);_trigger("swipe"+u);_cleanGesture()}else{_trigger("tap");if(GESTURE.taps===1){TOUCH_TIMEOUT=setTimeout(function(){_trigger("singleTap");return _cleanGesture()},100)}}}else{t=false;if(GESTURE.angle_difference!==0){_trigger("rotate",{angle:GESTURE.angle_difference});i=GESTURE.angle_difference>0?"rotateRight":"rotateLeft";_trigger(i,{angle:GESTURE.angle_difference});t=true}if(GESTURE.distance_difference!==0){_trigger("pinch",{angle:GESTURE.distance_difference});r=GESTURE.distance_difference>0?"pinchOut":"pinchIn";_trigger(r,{distance:GESTURE.distance_difference});t=true}if(!t&&CURRENT_TOUCH[0]){if(Math.abs(FIRST_TOUCH[0].x-CURRENT_TOUCH[0].x)>10||Math.abs(FIRST_TOUCH[0].y-CURRENT_TOUCH[0].y)>10){_trigger("drag");n=_swipeDirection(FIRST_TOUCH[0].x,CURRENT_TOUCH[0].x,FIRST_TOUCH[0].y,CURRENT_TOUCH[0].y);_trigger("drag"+n)}}_cleanGesture()}return EVENT=void 0};_fingersPosition=function(e,t){var n,r;r=[];n=0;e=e[0].targetTouches?e[0].targetTouches:e;while(n<t){r.push({x:e[n].pageX,y:e[n].pageY});n++}return r};_captureRotation=function(){var angle,diff,i,symbol;angle=parseInt(_angle(CURRENT_TOUCH),10);diff=parseInt(GESTURE.initial_angle-angle,10);if(Math.abs(diff)>20||GESTURE.angle_difference!==0){i=0;symbol=GESTURE.angle_difference<0?"-":"+";while(Math.abs(diff-GESTURE.angle_difference)>90&&i++<10){eval("diff "+symbol+"= 180;")}GESTURE.angle_difference=parseInt(diff,10);return _trigger("rotating",{angle:GESTURE.angle_difference})}};_capturePinch=function(){var e,t;t=parseInt(_distance(CURRENT_TOUCH),10);e=GESTURE.initial_distance-t;if(Math.abs(e)>10){GESTURE.distance_difference=e;return _trigger("pinching",{distance:e})}};_trigger=function(e,t){if(GESTURE.el){t=t||{};if(CURRENT_TOUCH[0]){t.iniTouch=GESTURE.fingers>1?FIRST_TOUCH:FIRST_TOUCH[0];t.currentTouch=GESTURE.fingers>1?CURRENT_TOUCH:CURRENT_TOUCH[0]}return GESTURE.el.trigger(e,t,EVENT)}};_cleanGesture=function(e){FIRST_TOUCH=[];CURRENT_TOUCH=[];GESTURE={};return clearTimeout(TOUCH_TIMEOUT)};_angle=function(e){var t,n,r;t=e[0];n=e[1];r=Math.atan((n.y-t.y)*-1/(n.x-t.x))*(180/Math.PI);if(r<0){return r+180}else{return r}};_distance=function(e){var t,n;t=e[0];n=e[1];return Math.sqrt((n.x-t.x)*(n.x-t.x)+(n.y-t.y)*(n.y-t.y))*-1};_getTouches=function(e){if($$.isMobile()){return e.touches}else{return[e]}};_parentIfText=function(e){if("tagName"in e){return e}else{return e.parentNode}};_swipeDirection=function(e,t,n,r){var i,u;i=Math.abs(e-t);u=Math.abs(n-r);if(i>=u){if(e-t>0){return"Left"}else{return"Right"}}else{if(n-r>0){return"Up"}else{return"Down"}}};return _hold=function(){if(GESTURE.last&&Date.now()-GESTURE.last>=HOLD_DELAY){_trigger("hold");return GESTURE.taps=0}}})(Quo)}).call(this);(function(){(function(e){e.fn.text=function(t){if(t||e.toType(t)==="number"){return this.each(function(){return this.textContent=t})}else{return this[0].textContent}};e.fn.html=function(t){var n;n=e.toType(t);if(t||n==="number"||n==="string"){return this.each(function(){var e,r,i,u;if(n==="string"||n==="number"){return this.innerHTML=t}else{this.innerHTML=null;if(n==="array"){u=[];for(r=0,i=t.length;r<i;r++){e=t[r];u.push(this.appendChild(e))}return u}else{return this.appendChild(t)}}})}else{return this[0].innerHTML}};e.fn.append=function(t){var n;n=e.toType(t);return this.each(function(){var e=this;if(n==="string"){return this.insertAdjacentHTML("beforeend",t)}else if(n==="array"){return t.each(function(t,n){return e.appendChild(n)})}else{return this.appendChild(t)}})};e.fn.prepend=function(t){var n;n=e.toType(t);return this.each(function(){var e=this;if(n==="string"){return this.insertAdjacentHTML("afterbegin",t)}else if(n==="array"){return t.each(function(t,n){return e.insertBefore(n,e.firstChild)})}else{return this.insertBefore(t,this.firstChild)}})};e.fn.replaceWith=function(t){var n;n=e.toType(t);this.each(function(){var e=this;if(this.parentNode){if(n==="string"){return this.insertAdjacentHTML("beforeBegin",t)}else if(n==="array"){return t.each(function(t,n){return e.parentNode.insertBefore(n,e)})}else{return this.parentNode.insertBefore(t,this)}}});return this.remove()};return e.fn.empty=function(){return this.each(function(){return this.innerHTML=null})}})(Quo)}).call(this);(function(){(function(e){var t,n,r,i,u,a;r="parentNode";t=/^\.([\w-]+)$/;n=/^#[\w\d-]+$/;i=/^[\w-]+$/;e.query=function(e,r){var u;r=r.trim();if(t.test(r)){u=e.getElementsByClassName(r.replace(".",""))}else if(i.test(r)){u=e.getElementsByTagName(r)}else if(n.test(r)&&e===document){u=e.getElementById(r.replace("#",""));if(!u){u=[]}}else{u=e.querySelectorAll(r)}if(u.nodeType){return[u]}else{return Array.prototype.slice.call(u)}};e.fn.find=function(t){var n;if(this.length===1){n=Quo.query(this[0],t)}else{n=this.map(function(){return Quo.query(this,t)})}return e(n)};e.fn.parent=function(e){var t;t=e?a(this):this.instance(r);return u(t,e)};e.fn.siblings=function(e){var t;t=this.map(function(e,t){return Array.prototype.slice.call(t.parentNode.children).filter(function(e){return e!==t})});return u(t,e)};e.fn.children=function(e){var t;t=this.map(function(){return Array.prototype.slice.call(this.children)});return u(t,e)};e.fn.get=function(e){if(e===undefined){return this}else{return this[e]}};e.fn.first=function(){return e(this[0])};e.fn.last=function(){return e(this[this.length-1])};e.fn.closest=function(t,n){var r,i;i=this[0];r=e(t);if(!r.length){i=null}while(i&&r.indexOf(i)<0){i=i!==n&&i!==document&&i.parentNode}return e(i)};e.fn.each=function(e){this.forEach(function(t,n){return e.call(t,n,t)});return this};a=function(t){var n;n=[];while(t.length>0){t=e.map(t,function(e){if((e=e.parentNode)&&e!==document&&n.indexOf(e)<0){n.push(e);return e}})}return n};return u=function(t,n){if(n===undefined){return e(t)}else{return e(t).filter(n)}}})(Quo)}).call(this);(function(){(function(e){var t,n,r;t=["-webkit-","-moz-","-ms-","-o-",""];e.fn.addClass=function(e){return this.each(function(){if(!r(e,this.className)){this.className+=" "+e;return this.className=this.className.trim()}})};e.fn.removeClass=function(e){return this.each(function(){if(!e){return this.className=""}else{if(r(e,this.className)){return this.className=this.className.replace(e," ").replace(/\s+/g," ").trim()}}})};e.fn.toggleClass=function(e){return this.each(function(){if(r(e,this.className)){return this.className=this.className.replace(e," ")}else{this.className+=" "+e;return this.className=this.className.trim()}})};e.fn.hasClass=function(e){return r(e,this[0].className)};e.fn.style=function(e,t){if(t){return this.each(function(){return this.style[e]=t})}else{return this[0].style[e]||n(this[0],e)}};e.fn.css=function(e,t){return this.style(e,t)};e.fn.vendor=function(e,n){var r,i,u,a;a=[];for(i=0,u=t.length;i<u;i++){r=t[i];a.push(this.style(""+r+e,n))}return a};r=function(e,t){var n;n=t.split(/\s+/g);return n.indexOf(e)>=0};return n=function(e,t){return document.defaultView.getComputedStyle(e,"")[t]}})(Quo)}).call(this);

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function(){for(var e=0,b=["ms","moz","webkit","o"],a=0;a<b.length&&!window.requestAnimationFrame;++a)window.requestAnimationFrame=window[b[a]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[b[a]+"CancelAnimationFrame"]||window[b[a]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(a,b){var c=(new Date).getTime(),d=Math.max(0,16-(c-e)),f=window.setTimeout(function(){a(c+d)},d);e=c+d;return f});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})})();

/**
 * @TODO
 * - the slide titles looks bad - make it on a transparent tapet at the bottom
 * - apply touch events (look for ready solutions)
 * - add callbacks
 * - fix - display image only after it's loaded completely
 */
;(function() {

	// helping tools
	var tools = {
		domReady: function(callbackFn) {
			if (typeof(callbackFn) !== 'function') {
				return;
			}
			if (document.readyState === 'complete' || document.readyState === 'interactive') {
				callbackFn();
			} else {
				document.addEventListener('DOMContentLoaded', callbackFn);
			}
		},
		// clear the dom element content
		empty: function(DOMElem) {
			while (DOMElem && DOMElem.firstChild) {
				DOMElem.removeChild(DOMElem.firstChild);
			}
		},

		createElement: function (tag, attrs, content, isHtml) {
			// create the element
			var newElem = document.createElement(tag);

			// set attributes
			if (attrs && attrs instanceof Object) {
				for (var attrName in attrs) {
					if (typeof(attrs[attrName]) !== 'function') {
						// validate value type
						var valueType = typeof(attrs[attrName]);
						if (['string', 'number'].indexOf(valueType) >= 0) {
							newElem.setAttribute(attrName, attrs[attrName]);
						}
					}
				}
			}

			// set the content
			if (content) {
				if (content instanceof HTMLElement) {
					newElem.appendChild(content);
				} else if (isHtml) {
					newElem.innerHTML = content;
				} else {
					newElem.textContent = content;
				}
			}

			return newElem;
		},

		getElementIndex: function (elem) {
			var i = 0;
			while( (elem = elem.previousSibling) !== null ) i++;
			return i;
		},

		getElementRelativeTop: function(elem) {
			return elem.offsetTop - elem.parentNode.offsetTop;
		},

		// merge two objects, override obj1 properties with obj2 properties
		merge_objects: function(obj1, obj2) {
			var obj3 = {};
			for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
			for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
			return obj3;
		},

		// animate(elem, [{property: 'height', start: '10px', end: '100px'}, {..}, ..]
		// OR
		// animate(elem, {property: 'height', start: '10px', end: '100px'});
		// OR (with callback)
		// animate(elem, {property: 'height', start: '10px', end: '100px'}, function() { alert('finished'); });
		//
		// TODO
		// - work with non css properties (like scrollTop)
		animate: (function() {
			var destinationDivide = 3;
			var animate = function(elem, properties, callbackFn) {
				var stopAnimationCount = 0;

				properties.forEach(function(prop) {
					var hasPx = (elem.style[prop.property].toLowerCase().indexOf('px') >= 0);
					var initialValue = parseFloat(elem.style[prop.property]);
					var finalValue = parseFloat(prop.end);
					var delta;

					// calculate the delta. if left less than 5%, jump it
					if (Math.abs(finalValue - initialValue) < Math.abs((parseFloat(prop.end) - parseFloat(prop.start))) * 0.05) {
						delta = finalValue - initialValue;
					} else {
						if (hasPx) {
							delta = Math.round((finalValue - initialValue) / destinationDivide);
						} else {
							delta = ((finalValue - initialValue) / destinationDivide);
						}
					}

					if (delta === 0) {
						stopAnimationCount ++;
					} else {
						var nextValue = initialValue + delta;
						if (hasPx) {
							elem.style[prop.property] = nextValue + 'px';
						} else {
							elem.style[prop.property] = nextValue;
						}
					}
				});

				if (stopAnimationCount < properties.length) {
					requestAnimationFrame(function() {
						animate(elem, properties, callbackFn);
					});
				} else {
					if (typeof (callbackFn) === 'function') {
						callbackFn();
					}
				}
			};

			// several properties
			// properties = [{property:'left', start:0, end:'300px'}, {property:'width', start:'100px', end:'400px'}, ...]

			// or one
			// properties = {property:'left', start:0, end:'300px'}
			return function(elem, properties, callbackFn) {
				if (!(properties instanceof Array)) properties = [properties];

				// set initial values
				properties.forEach(function(prop) {
					elem.style[prop.property] = prop.start;
				});

				requestAnimationFrame(function() {
					animate(elem, properties, callbackFn);
				});
			};
		})()
	};

	// define bizon object
	var bizonObj = function(container, options) {
		// private configurable // 

		// set default options
		var defaultOptions = {
			'fullScreen': false,
			'smallImagesWrapperMinWidth': 80,
			'smallImagesPadding': 3
		};
		options = tools.merge_objects(defaultOptions, options);

		// space between each small image and its wrapper
		this._smallImagesPadding = options['smallImagesPadding'];
		// min width of the small images area
		this._smallImagesWrapperMinWidth = options['smallImagesWrapperMinWidth'];

		// private //

		this._bigImage = null; // IMG
		this._bigImageTitle = null; // DIV
		this._bigImageWrapper = null; // DIV (>IMG)
		this._smallImagesWrapper = null; // DIV (>DIVs>IMG)
		this._currentImage = 0;
		
		this._callbacks = {};
		
		this._fullScreenMode = options['fullScreen'];
		this._initialContainerWidth = container.clientWidth;
		this._initialContainerHeight = container.clientHeight;

		// public // 

		this.container = container;
		this.images = [];
		
		// initializers 

		this.loadImages();
		this.buildDom();
		this.bindEvents();
		this.fixSize();
		
		var that = this;
		window.addEventListener('resize', function() {
			that.fixSize();
		}, false);
	};

	bizonObj.prototype = {
		on: function(eventName, callbackFn) {
			if (typeof(this._callbacks[eventName]) == 'undefined') {
				this._callbacks[eventName] = [];
			}
			
			this._callbacks[eventName].push(callbackFn);
		},
		
		_trigger: function(eventName) {
			if (this._callbacks[eventName]) {
				this._callbacks[eventName].forEach(function(callbackFn) {
					if (typeof(callbackFn) == 'function') {
						callbackFn();
					}
				});
			}
		},
			
		// function(scrollTo, elem)
		animateScrollTo: (function() {

			var timeoutInterval = 10;
			var destinationDivide = 3;
			var finalScrollTo;

			var animate = function(elem) {
				var initialScrollTop = elem.scrollTop;
				var maxScrollTop = elem.scrollHeight - elem.clientHeight;
				var delta = Math.floor((finalScrollTo - initialScrollTop) / destinationDivide);
				if (delta === 0 || (initialScrollTop >= maxScrollTop && finalScrollTo >= maxScrollTop)) {
					return;
				}

				var nextScrollTop = initialScrollTop + delta;
				elem.scrollTop = nextScrollTop;

				requestAnimationFrame(function() {
					animate(elem);
				});
			};

			return function(scrollTo, elem) {
				finalScrollTo = scrollTo;
				requestAnimationFrame(function() {
					animate(elem);
				});
			};
		})(),
		// function(newHeight, elem)
		animateHeightTo: function(newHeight, elem) {
			tools.animate(elem, {property: 'height', start: elem.clientHeight + 'px', end: newHeight + 'px'});
		},

		// function(newHeight, elem)
		fadeOut: function(elem, callbackFn) {
			tools.animate(elem, {property: 'opacity', start: 0.9, end: 0}, callbackFn);
		}, 
		// load images into an object
		loadImages: function() {
			this.images = [];

			var that = this;
			[].forEach.call(this.container.querySelectorAll('img'), function(img) {
				var imgWidth = parseInt(img.getAttribute('width')) || that._initialContainerWidth,
					imgHeight = parseInt(img.getAttribute('height')) || that._initialContainerHeight;
				that.images.push({
					src: img.getAttribute('src'), 
					fullImageSrc: img.getAttribute('full-image-src') || img.getAttribute('src'),
					width: imgWidth,
					height: imgHeight,
					title: img.getAttribute('title'),
					alt: img.getAttribute('alt'),
					ratio: imgWidth / imgHeight
				});

				// preload the images
				var preloadImg = document.createElement('img');
				preloadImg.src = img.getAttribute('full-image-src') || img.getAttribute('src');
			});
		},
		// create initial DOM for the gallery
		buildDom: function() {
			//if (this.container.classList.contains('bizon-initialized')) return;
			tools.empty(this.container);
			if (!this.container.classList.contains('bizon')) {
				this.container.classList.add('bizon');
			}

			// big image
			this._bigImage = tools.createElement('img', {'src':this.images[this._currentImage].fullImageSrc});
			this._bigImageWrapper = tools.createElement('div', {'class':'bizon-image-wrapper'}, this._bigImage);
			this._bigImageWrapper.appendChild(tools.createElement('div', {'class': 'bizon-album-title', 'title': (this.container.getAttribute('title') || 'Gallery')}, this.container.getAttribute('title') || 'Gallery'));
			this._bigImageTitle = tools.createElement('div', {'class': 'bizon-image-title'}, 'Image description goes here...');
			this._bigImageWrapper.appendChild(this._bigImageTitle);
			this._bigImageWrapper.appendChild(tools.createElement('div', {'class': 'bizon-arrow-right', 'title': 'Next image'}));
			this._bigImageWrapper.appendChild(tools.createElement('div', {'class': 'bizon-arrow-left', 'title': 'Previous image'}));
			this._bigImageWrapper.appendChild(tools.createElement('div', {'class': 'bizon-full-screen', 'title': 'Full screen'}));
			this._bigImageWrapper.appendChild(tools.createElement('div', {'class': 'bizon-close', 'title': 'Close'}));

			// small images
			this._smallImagesWrapper = tools.createElement('div', {'class':'bizon-small-images-wrapper'});
			for (var i=0, totalImages=this.images.length; i<totalImages; i++) {
				var smallImageWrapper = tools.createElement('div', {'class':'bizon-small-image-wrapper'});
				if (i===0) smallImageWrapper.classList.add('bizon-active');

				var smallImage = tools.createElement('img', {
					'src': this.images[i].src,
					'class': 'bizon-small-image'
				});
				smallImageWrapper.appendChild(smallImage);
				this._smallImagesWrapper.appendChild(smallImageWrapper);
			}

			// add to container
			this.container.appendChild(this._bigImageWrapper);
			this.container.appendChild(this._smallImagesWrapper);

			this.setActiveImage();

			this.container.classList.add('bizon-initialized');
		},
		// set main image + scroll to thumb's place
		setActiveImage: (function() {
			var thisObj;
			var moveTitleLeftTimer = null;
			var showImageTitle = function(elem, callbackFn) {
				elem = thisObj._bigImageTitle;
				tools.animate(elem, {property: 'left', start: elem.style.left, end: 0}, callbackFn);
			};
			var hideImageTitle = function(elem, callbackFn) {
				elem = thisObj._bigImageTitle;
				tools.animate(elem, {property: 'left', start: 0, end: (-1 * (elem.clientWidth - 20)) + 'px'}, callbackFn);
			}; 
			var showAlbumTitle = function(elem, callbackFn) {
				elem = thisObj.container.querySelector('.bizon-album-title');
				tools.animate(elem, {property: 'left', start: elem.style.left, end: 0}, callbackFn);
			};
			var hideAlbumTitle = function(elem, callbackFn) {
				elem = thisObj.container.querySelector('.bizon-album-title');
				tools.animate(elem, {property: 'left', start: 0, end: (-1 * (elem.clientWidth - 20)) + 'px'}, callbackFn);
			}; 

			return function(imgNumber) {
				var that = thisObj = this;
				if (typeof(imgNumber) == 'undefined') imgNumber = this._currentImage; 
				this._currentImage = imgNumber;

				// remove `active` 
				var currentActiveElem = this._smallImagesWrapper.querySelector('.bizon-active');
				if (currentActiveElem) currentActiveElem.classList.remove('bizon-active');

				// mark relevant small image as active 
				var theSmallImage = this._smallImagesWrapper.querySelectorAll('div.bizon-small-image-wrapper')[imgNumber];
				if (theSmallImage) {
					theSmallImage.classList.add('bizon-active');
				}
				
				this._bigImage.src = this.images[imgNumber].fullImageSrc;

				// set image title
				var albumTitle = this.container.querySelector('.bizon-album-title');
				this._bigImageTitle.style.left = albumTitle.style.left = 0;
				this._bigImageTitle.textContent = this.images[this._currentImage].alt || this.images[this._currentImage].title; 
				this._bigImageTitle.setAttribute('title', this._bigImageTitle.textContent);
				that._bigImageTitle.removeEventListener('mouseover', showImageTitle);
				that._bigImageTitle.removeEventListener('mouseout', hideImageTitle);
				albumTitle.removeEventListener('mouseover', showAlbumTitle);
				albumTitle.removeEventListener('mouseout', hideAlbumTitle);


				// hide titlie after a second
				clearTimeout(moveTitleLeftTimer);
				moveTitleLeftTimer = setTimeout(function() {
					hideImageTitle(that._bigImageTitle, function() {
						that._bigImageTitle.addEventListener('mouseover', showImageTitle);
						that._bigImageTitle.addEventListener('mouseout', hideImageTitle);
					});
					hideAlbumTitle(albumTitle, function() {
						albumTitle.addEventListener('mouseover', showAlbumTitle);
						albumTitle.addEventListener('mouseout', hideAlbumTitle);
					});
				}, 1000);

				// fix small images scroll
				// if below
				var smallImageScrollTop = tools.getElementRelativeTop(theSmallImage);
				if (smallImageScrollTop + theSmallImage.clientHeight > this._smallImagesWrapper.scrollTop + this.container.clientHeight) {
					// this._smallImagesWrapper.scrollTop = theSmallImage.offsetTop;
					this.animateScrollTo(tools.getElementRelativeTop(theSmallImage), this._smallImagesWrapper);
				}
				// if above
				if (smallImageScrollTop < this._smallImagesWrapper.scrollTop) {
					// this._smallImagesWrapper.scrollTop = theSmallImage.offsetTop;
					this.animateScrollTo(smallImageScrollTop, this._smallImagesWrapper);
				}

				// hide arrows
				if (this._currentImage === 0) {
					this.container.getElementsByClassName('bizon-arrow-left')[0].style.visibility = 'hidden';
				} else {
					this.container.getElementsByClassName('bizon-arrow-left')[0].style.visibility = 'visible';
				}

				if (this._currentImage >= this.images.length - 1) {
					this.container.getElementsByClassName('bizon-arrow-right')[0].style.visibility = 'hidden';
				} else {
					this.container.getElementsByClassName('bizon-arrow-right')[0].style.visibility = 'visible';
				}

				this._bigImage.style.opacity = 1;
				this.fixSize();
			};
		})(),
		// fix elements sized according to the image/screen
		fixSize: function() {
			var that = this;

			// get full width/height
			var containerWidth, containerHeight,
				bigImageWrapperWidth;
			
			if (this._fullScreenMode) {

				// set width and height as the size of the window
				containerWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
				containerHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

				bigImageWrapperWidth = containerWidth;
				if (containerWidth > 800) bigImageWrapperWidth-= 20;
				
				this.container.classList.add('bizon-full-screen-container');
				this.container.style.width = containerWidth + 'px';
				this.container.style.height = containerHeight + 'px';
			} else {
				// set width and height as the size of the container
				containerWidth = this._initialContainerWidth; // this.container.clientWidth;
				containerHeight = this._initialContainerHeight;
				bigImageWrapperWidth = Math.floor(containerWidth * 0.95) - 20

				this.container.classList.remove('bizon-full-screen-container');
				this.container.style.width = containerWidth + 'px';
				this.container.style.height = containerHeight + 'px';
			}
			
			// fix small/big images wrapper
			var smallImagesWrapper = Math.floor(containerWidth * 0.05);
			if (!this._fullScreenMode && smallImagesWrapper < this._smallImagesWrapperMinWidth) {
				var deltaTillMinimum = this._smallImagesWrapperMinWidth - smallImagesWrapper;
				smallImagesWrapper = this._smallImagesWrapperMinWidth;
				bigImageWrapperWidth-= deltaTillMinimum;
			}

			var bigImageWrapperRatio = bigImageWrapperWidth / containerHeight;

			// fix big image wrapper
			this._bigImageWrapper.style.width = bigImageWrapperWidth + 'px';
			this._bigImageWrapper.style.height = containerHeight + 'px';

			// set max width of the titles
			this.container.querySelector('.bizon-album-title').style.maxWidth = bigImageWrapperWidth + 'px';
			this._bigImageTitle.style.maxWidth = bigImageWrapperWidth + 'px';

			// set small images wrapper
			this._smallImagesWrapper.style.width = 10 + smallImagesWrapper+ 'px';
			this._smallImagesWrapper.style.height = containerHeight + 'px';
			this._smallImagesWrapper.style.marginLeft = '10px';
			if (this._fullScreenMode) {
				this._smallImagesWrapper.style.display = 'none';
			} else {
				this._smallImagesWrapper.style.display = 'block';
			}

			// fix small images
			[].forEach.call(this._smallImagesWrapper.querySelectorAll('.bizon-small-image-wrapper'), function(elem) {
				elem.style.padding = that._smallImagesPadding + 'px';
				elem.firstChild.style.width = (smallImagesWrapper - (that._smallImagesPadding * 2) - 17) + 'px'; // 17 - scroll width
			});

			// fix main image
			var currentImage = this.images[this._currentImage];
			var bigImageRatio = currentImage.ratio;
			if (bigImageRatio > bigImageWrapperRatio) {
				// set max width
				this._bigImage.style.width = bigImageWrapperWidth + 'px';
				var bigImageHeight = Math.floor(bigImageWrapperWidth / bigImageRatio);
				this._bigImage.style.height = bigImageHeight + 'px';

				// fix top position
				var imgTop = Math.floor((containerHeight - bigImageHeight) / 2);
				this._bigImage.style.top = imgTop + 'px';
				this._bigImage.style.left = 0;
			} else {
				// set max height
				var bigImageWidth = Math.floor(containerHeight * bigImageRatio);
				this._bigImage.style.width = bigImageWidth + 'px';
				this._bigImage.style.height = containerHeight + 'px';

				// fix left position
				var imgLeft = Math.floor((bigImageWrapperWidth - bigImageWidth) / 2);
				this._bigImage.style.top = 0;
				this._bigImage.style.left = imgLeft + 'px';
			}

		},
		// go to the next image (if there is)
		nextImage: function() {
			if (this._currentImage + 1 < this.images.length) {
				this._currentImage++;
				var that = this;
				this.fadeOut(this._bigImage, function() {
					that.setActiveImage();
				});
			}
		},
		// go to the previous image (if there is)
		prevImage: function() {
			if (this._currentImage > 0) {
				this._currentImage--;
				var that = this;
				this.fadeOut(this._bigImage, function() {
					that.setActiveImage();
				});
			} 
		},
		// close (slide-up) the gallery (DOM is not removed, it becomes height 0)
		close: function() {
			var that = this;
			this.animateHeightTo(0, this.container, function() {
				that.container.parentNode.removeChild(that.container);
			});
			
			this._trigger('close');
		},
		enterFullScreenMode: function() {
			if (!document.fullscreenElement &&
					!document.mozFullScreenElement && 
					!document.webkitFullscreenElement && 
					!document.msFullscreenElement 
			   ) {  // current working methods
				   if (document.documentElement.requestFullscreen) {
					   document.documentElement.requestFullscreen();
				   } else if (document.documentElement.msRequestFullscreen) {
					   document.documentElement.msRequestFullscreen();
				   } else if (document.documentElement.mozRequestFullScreen) {
					   document.documentElement.mozRequestFullScreen();
				   } else if (document.documentElement.webkitRequestFullscreen) {
					   document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				   }
			   }
		},
		exitFullScreenMode: function() {
			if (document.fullscreenElement ||
				document.mozFullScreenElement || 
				document.webkitFullscreenElement || 
				document.msFullscreenElement
			   ) {  // current working methods
				   // close full screen mode (if was before)
				   if (document.exitFullscreen) {
					   document.exitFullscreen();
				   } else if (document.msExitFullscreen) {
					   document.msExitFullscreen();
				   } else if (document.mozCancelFullScreen) {
					   document.mozCancelFullScreen();
				   } else if (document.webkitExitFullscreen) {
					   document.webkitExitFullscreen();
				   }
			   }
		},
		// bind gallery events
		bindEvents: function() {
			var that = this;

			// click small image (wrapper)
			[].forEach.call(this.container.querySelectorAll('.bizon-small-image-wrapper'), function(imgWrapper) {
				imgWrapper.addEventListener('click', function() {
					var elem = imgWrapper;
					if (elem.classList.contains('bizon-small-image-wrapper')) {
						var imgNumber = tools.getElementIndex(elem);
						that.setActiveImage(imgNumber);
					}
				});
			});

			// click "next"
			that.container.getElementsByClassName('bizon-arrow-right')[0].addEventListener('click', function() {
				that.nextImage();
			});

			// click "prev"
			that.container.querySelector('.bizon-arrow-left').addEventListener('click', function() {
				that.prevImage();
			});

			// click "fullscreen"
			that.container.querySelector('.bizon-full-screen').addEventListener('click', function() {
				that._fullScreenMode = !that._fullScreenMode;
				if (that._fullScreenMode) {
					that.enterFullScreenMode();
				} else {
					that.exitFullScreenMode();
				}
				that.setActiveImage();
			});
			
			var timer = null;
			window.addEventListener('keydown', function(evt) {
				if (timer) clearTimeout(timer);
				// check press button "right"
				if (evt.keyCode == 39 || evt.keyCode == 40) {
					timer = setTimeout(function() {
						that.nextImage();
					}, 10);
				}
				
				// check press button "left"
				if (evt.keyCode == 37 || evt.keyCode == 38) {
					timer = setTimeout(function() {
						that.prevImage();
					}, 10);
				}

				if (evt.keyCode == 27) {
					that._fullScreenMode = false;
					that.exitFullScreenMode();
					that.setActiveImage();
				}
				
			});
			
			// click on main image 
			that.container.querySelector('.bizon-image-wrapper img').addEventListener('click', function() {
				that.nextImage();
			});

			// click on "close"
			that.container.querySelector('.bizon-close').addEventListener('click', function() {
				that.close();
			});

			// swipe left - next image
			if (window.$$) {
				var hm = $$(this.container);
				hm.swipeLeft(function() {
					that.nextImage();
				});
				hm.swipeRight(function() {
					that.prevImage();
				});
			}
		}
	};

	// define main bizon function
	window.bizon = function(container, options) {
		return new bizonObj(container, options);
	};

	// initialize bizon galleries - all elements with class "bizon"
	if (location.hash.length > 0 && location.hash === '#autoload') {
		tools.domReady(function() {
			[].forEach.call(document.querySelectorAll('.bizon'), function(bizonContainer) {
				window.bizon(bizonContainer);
			});
		});
	}

})();
