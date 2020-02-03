"use strict";define(["module"],function(e){var n,r,t,i,o,a=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],s=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,u=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,l="undefined"!=typeof location&&location.href,f=l&&location.protocol&&location.protocol.replace(/\:/,""),c=l&&location.hostname,p=l&&(location.port||undefined),d={},v=e.config&&e.config()||{};function m(e,n){return e===undefined||""===e?n:e}return n={version:"2.0.15",strip:function(e){if(e){var n=(e=e.replace(s,"")).match(u);n&&(e=n[1])}else e="";return e},jsEscape:function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")},createXhr:v.createXhr||function(){var e,n,r;if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"!=typeof ActiveXObject)for(n=0;n<3;n+=1){r=a[n];try{e=new ActiveXObject(r)}catch(t){}if(e){a=[r];break}}return e},parseName:function(e){var n,r,t,i=!1,o=e.lastIndexOf("."),a=0===e.indexOf("./")||0===e.indexOf("../");return-1!==o&&(!a||o>1)?(n=e.substring(0,o),r=e.substring(o+1)):n=e,-1!==(o=(t=r||n).indexOf("!"))&&(i="strip"===t.substring(o+1),t=t.substring(0,o),r?r=t:n=t),{moduleName:n,ext:r,strip:i}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(e,r,t,i){var o,a,s,u=n.xdRegExp.exec(e);return!u||(o=u[2],s=(a=(a=u[3]).split(":"))[1],a=a[0],(!o||o===r)&&(!a||a.toLowerCase()===t.toLowerCase())&&(!s&&!a||function(e,n,r,t){if(n===t)return!0;if(e===r){if("http"===e)return m(n,"80")===m(t,"80");if("https"===e)return m(n,"443")===m(t,"443")}return!1}(o,s,r,i)))},finishLoad:function(e,r,t,i){t=r?n.strip(t):t,v.isBuild&&(d[e]=t),i(t)},load:function(e,r,t,i){if(i&&i.isBuild&&!i.inlineText)t();else{v.isBuild=i&&i.isBuild;var o=n.parseName(e),a=o.moduleName+(o.ext?"."+o.ext:""),s=r.toUrl(a),u=v.useXhr||n.useXhr;0!==s.indexOf("empty:")?!l||u(s,f,c,p)?n.get(s,function(r){n.finishLoad(e,o.strip,r,t)},function(e){t.error&&t.error(e)}):r([a],function(e){n.finishLoad(o.moduleName+"."+o.ext,o.strip,e,t)}):t()}},write:function(e,r,t,i){if(d.hasOwnProperty(r)){var o=n.jsEscape(d[r]);t.asModule(e+"!"+r,"define(function () { return '"+o+"';});\n")}},writeFile:function(e,r,t,i,o){var a=n.parseName(r),s=a.ext?"."+a.ext:"",u=a.moduleName+s,l=t.toUrl(a.moduleName+s)+".js";n.load(u,t,function(r){var t=function(e){return i(l,e)};t.asModule=function(e,n){return i.asModule(e,l,n)},n.write(e,u,t,o)},o)}},"node"===v.env||!v.env&&"undefined"!=typeof process&&process.versions&&process.versions.node&&!process.versions["node-webkit"]&&!process.versions["atom-shell"]?(r=require.nodeRequire("fs"),n.get=function(e,n,t){try{var i=r.readFileSync(e,"utf8");"\ufeff"===i[0]&&(i=i.substring(1)),n(i)}catch(o){t&&t(o)}}):"xhr"===v.env||!v.env&&n.createXhr()?n.get=function(e,r,t,i){var o,a=n.createXhr();if(a.open("GET",e,!0),i)for(o in i)i.hasOwnProperty(o)&&a.setRequestHeader(o.toLowerCase(),i[o]);v.onXhr&&v.onXhr(a,e),a.onreadystatechange=function(n){var i,o;4===a.readyState&&((i=a.status||0)>399&&i<600?((o=new Error(e+" HTTP status: "+i)).xhr=a,t&&t(o)):r(a.responseText),v.onXhrComplete&&v.onXhrComplete(a,e))},a.send(null)}:"rhino"===v.env||!v.env&&"undefined"!=typeof Packages&&"undefined"!=typeof java?n.get=function(e,n){var r,t,i=new java.io.File(e),o=java.lang.System.getProperty("line.separator"),a=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(i),"utf-8")),s="";try{for(r=new java.lang.StringBuffer,(t=a.readLine())&&t.length()&&65279===t.charAt(0)&&(t=t.substring(1)),null!==t&&r.append(t);null!==(t=a.readLine());)r.append(o),r.append(t);s=String(r.toString())}finally{a.close()}n(s)}:("xpconnect"===v.env||!v.env&&"undefined"!=typeof Components&&Components.classes&&Components.interfaces)&&(t=Components.classes,i=Components.interfaces,Components.utils["import"]("resource://gre/modules/FileUtils.jsm"),o="@mozilla.org/windows-registry-key;1"in t,n.get=function(e,n){var r,a,s,u={};o&&(e=e.replace(/\//g,"\\")),s=new FileUtils.File(e);try{(r=t["@mozilla.org/network/file-input-stream;1"].createInstance(i.nsIFileInputStream)).init(s,1,0,!1),(a=t["@mozilla.org/intl/converter-input-stream;1"].createInstance(i.nsIConverterInputStream)).init(r,"utf-8",r.available(),i.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER),a.readString(r.available(),u),a.close(),r.close(),n(u.value)}catch(l){throw new Error((s&&s.path||"")+": "+l)}}),n});