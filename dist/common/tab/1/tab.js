"use strict";define(["common/kernel/kernel","./lang"],function(t,i){var s=$('<div><a class="reload" href="javascript:;">'+i.reload+'</a><a class="closeOther" href="javascript:;">'+i.closeOther+'</a><a class="closeLeft" href="javascript:;">'+i.closeLeft+'</a><a class="closeRight" href="javascript:;">'+i.closeRight+"</a></div>"),e={open:function(i){var s,e,a;if(i.id in this.cfg){if(i.args){for(o(i.args,this.cfg[i.id].args),s=0;s<this.list.length;s++)if(t.isSameLocation(i,this.list[s])){e=!0;break}}else for(s=0;s<this.list.length;s++)if(this.list[s].id===i.id){e=!0;break}e?this.tabs[s].loaded&&(a=!0):s=this.add(i),this.show(s),a&&this.reload()}return s},add:function(i){var s,e,a,h="tab-"+this.name+"/"+i.id+"/",f=this;if(i.id in this.cfg)return i.args||(i.args={}),o(i.args,this.cfg[i.id].args),e={head:$('<span class="'+i.id+'"><span title="'+this.cfg[i.id].title+'">'+this.cfg[i.id].title+'</span><a href="javascript:;"></a></span>'),body:$('<div class="'+i.id+'"></div>'),args:i.args,parent:this,setTitle:n},this.inv&&this.tabs.length?this.tabs[this.tabs.length-1].head.before(e.head):this.tabCtn.append(e.head),this.tabContent.append(e.body),s=this.list.length,this.list.push(i),this.tabs.push(e),"string"==typeof this.cfg[i.id].css&&(this.cfg[i.id].css=t.appendCss(require.toUrl(h+this.cfg[i.id].css))),2===this.cfg[i.id].status?r():(t.listeners.add(this.cfg[i.id],"complete",function p(a){t.listeners.remove(f.cfg[i.id],"complete",p);s=f.tabs.indexOf(e);2===f.cfg[i.id].status?(r(),s>=0&&(f.active===undefined||f.active===s)&&f.show(s)):s>=0&&f.close(s)}),1!==this.cfg[i.id].status&&(this.cfg[i.id].status=1,"html"in this.cfg[i.id]?(a=require.toUrl(h+this.cfg[i.id].html),$.ajax({url:a,type:"get",dataType:"text",success:function(t){delete f.cfg[i.id].html,f.cfg[i.id].htmlContent=t,l()},error:function(t,s){f.cfg[i.id].status=0,f.cfg[i.id].oncomplete({type:"complete"}),BUILD&&404===t.status?d():c(a,t.status)},complete:t.hideLoading}),t.showLoading()):l())),this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"}),s;function l(){var s;"js"in f.cfg[i.id]?(t.showLoading(),s=h+f.cfg[i.id].js,require([s],function(s){delete f.cfg[i.id].js,f.cfg[i.id].proto=s,f.cfg[i.id].status=2,f.cfg[i.id].oncomplete({type:"complete"}),t.hideLoading()},BUILD&&function(e){require.undef(s),f.cfg[i.id].status=0,f.cfg[i.id].oncomplete({type:"complete"}),e.requireType&&"scripterror"!==e.requireType&&"nodefine"!==e.requireType||e.xhr&&404!==e.xhr.status?c(s,e.message):d(),t.hideLoading()})):(f.cfg.status=2,f.cfg[i.id].oncomplete({type:"complete"}))}function r(){f.cfg[i.id].htmlContent&&e.body.html(f.cfg[i.id].htmlContent),Object.assign(e,f.cfg[i.id].proto)}},show:function(t){var i;t>=0&&t<this.list.length&&("number"==typeof this.active&&this.active!==t&&("function"==typeof this.tabs[this.active].onhide&&this.tabs[this.active].onhide(),this.tabCtn.find(">span.active").removeClass("active"),this.tabContent.find(">div.active").removeClass("active")),this.tabs[t].body.addClass("active"),this.tabs[t].head.addClass("active"),2===this.cfg[this.list[t].id].status&&(this.tabs[t].loaded||(i=!0,"function"==typeof this.tabs[t].onload&&this.tabs[t].onload(),this.tabs[t].loaded=!0),this.active===t&&!i||"function"!=typeof this.tabs[t].onshow||this.tabs[t].onshow()),this.active=t,this.save())},close:function(t){t>=0&&t<this.tabs.length&&(this.active===t&&(this.list.length>t+1?this.show(t+1):this.list.length>1?this.show(t-1):("function"==typeof this.tabs[t].onhide&&this.tabs[t].onhide(),this.active=undefined)),this.tabs[t].loaded&&"function"==typeof this.tabs[t].onunload&&this.tabs[t].onunload(),this.tabs[t].head.remove(),this.tabs[t].body.remove(),this.tabs.splice(t,1),this.list.splice(t,1),this.active>t&&this.active--,this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"}))},clear:function(){var t;if(this.tabs.length){for(t=0;t<this.list.length;t++)t===this.active&&"function"==typeof this.tabs[t].onhide&&this.tabs[t].onhide(),this.tabs[t].loaded&&"function"==typeof this.tabs[t].onunload&&this.tabs[t].onunload(),this.tabs[t].head.remove(),this.tabs[t].body.remove();this.list=[],this.tabs=[],this.active=undefined,this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"})}},closeOther:function(t){var i;if(t>0&&t<this.tabs.length-1){for(i=0;i<this.list.length;i++)i!==t&&(i===this.active&&"function"==typeof this.tabs[i].onhide&&this.tabs[i].onhide(),this.tabs[i].loaded&&"function"==typeof this.tabs[i].onunload&&this.tabs[i].onunload(),this.tabs[i].head.remove(),this.tabs[i].body.remove());this.list=[this.list[t]],this.tabs=[this.tabs[t]],this.active===t?(this.active=0,this.save()):(this.active=undefined,this.show(0)),"function"==typeof this.onchange&&this.onchange({type:"change"})}},closeLeft:function(t){var i=0;if(t>0&&t<this.tabs.length){for(;i<t;)i===this.active&&"function"==typeof this.tabs[i].onhide&&this.tabs[i].onhide(),this.tabs[i].loaded&&"function"==typeof this.tabs[i].onunload&&this.tabs[i].onunload(),this.tabs[i].head.remove(),this.tabs[i].body.remove(),i++;this.list.splice(0,t),this.tabs.splice(0,t),this.active<t?(this.active=undefined,this.show(0)):(this.active-=t,this.save()),"function"==typeof this.onchange&&this.onchange({type:"change"})}},closeRight:function(t){var i=t+1,s=i;if(t>=0&&t<this.tabs.length-1){for(;i<this.tabs.length;)i===this.active&&"function"==typeof this.tabs[i].onhide&&this.tabs[i].onhide(),this.tabs[i].loaded&&"function"==typeof this.tabs[i].onunload&&this.tabs[i].onunload(),this.tabs[i].head.remove(),this.tabs[i].body.remove(),i++;i=this.tabs.length-s,this.list.splice(s,i),this.tabs.splice(s,i),this.active>t?(this.active=undefined,this.show(t)):this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"})}},reload:function(){"number"==typeof this.active&&"function"==typeof this.tabs[this.active].onload&&this.tabs[this.active].onload()},save:function(){localStorage.setItem("tab-"+this.name,JSON.stringify({active:this.active,list:this.list}))}};return t.appendCss(require.toUrl("common/tab/tab.less")),function(t,i,n,o,c){var d,f,l=Object.create(e);l.list=[],l.tabs=[],l.name=t,l.cfg=i,l.tabCtn=n,l.tabContent=o,l.inv=c,c&&n.addClass("inv"),n.on("click",">span>span",function(){var t=a(l,this.parentNode);l.active!==t&&l.show(t)}).on("click",">span>a",function(){l.close(a(l,this.parentNode))}).on("contextmenu",">span",function(){return s.parent()[0]!==this&&($(this).append(s),$(document).one("click",h)),!1}).on("click",">span>div>a",function(){l[this.className](a(l,this.parentNode.parentNode))}),o.on("click",".closepage",function(){l.close(a(l,n.find("span.active")[0]))});try{f=JSON.parse(localStorage.getItem("tab-"+t))}catch(r){}if("object"===$.type(f)&&"number"==typeof f.active&&"array"===$.type(f.list)){for(d=0;d<f.list.length;d++)l.add(f.list[d]);l.show(f.active)}return l};function a(t,i){var s;for(s=0;s<t.tabs.length;s++)if(i===t.tabs[s].head[0])return s}function n(t){this.head.find(">span").prop("title",t).text(t)}function h(){s.remove()}function o(t,i){var s;if(i)for(s in i)s in t||(t[s]=i[s])}function c(s,e){t.alert(i.error.replace("${res}",s)+e)}function d(){t.confirm(i.update,function(t){t&&location.reload()})}});