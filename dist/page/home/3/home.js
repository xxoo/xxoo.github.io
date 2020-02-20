"use strict";define(["module","common/kernel/kernel","common/chart/chart"],function(e,t,n){var s,o,a,r,c=e.id.replace(/^[^/]+\/|\/[^/]+/g,""),u=document.querySelector("#page>."+c),l=new n(u.querySelector(".chart"),!0),i=new n(u.querySelector(".subchart"),!1,!0),d="https://trade.tinysoft.com.cn/webapi/api2.tsl",f=[[{},{}],[{},{}],[{},{}]],h={},v={},g=u.querySelector(".list>.name"),m=u.querySelector(".list>.canvas>canvas").getContext("2d"),p=u.querySelector(".list>span");return i.colorful=!0,i.labeling=function(e,t){return t?Math.round(1e3*e)/10+"%":new Date(L(r[e])).toISOString().replace(/T.*$/,"")},l.labeling=function(e,t){return t?Math.round(o[l.selected].data[e]/o[l.selected].rate*100)/100:new Date(L(r[e+o[l.selected].offset])).toISOString().replace(/T.*$/,"")},l.onrangechange=function(){if(l.selected){var e=l.cross-o[l.selected].cross-o[l.selected].offset;i.setRange(l.begin-e,l.end-e)}},m.canvas.width=1,m.canvas.addEventListener("mousedown",function w(e){0===e.button&&s.length&&(m.canvas.removeEventListener("mousedown",w),m.canvas.addEventListener("mousemove",t),document.addEventListener("mouseup",function n(e){0===e.button&&(m.canvas.addEventListener("mousedown",w),m.canvas.removeEventListener("mousemove",t),document.removeEventListener("mouseup",n))}),t(e));function t(e){e.offsetY>=0&&e.offsetY<=m.canvas.offsetHeight&&S(e.offsetY)}}),m.canvas.addEventListener("keydown",function(e){if(l.selected&&(38===e.keyCode||40===e.keyCode)){e.preventDefault();var t=s.indexOf(l.selected);38===e.keyCode?t>0&&S(this.offsetHeight*(t-1)/(s.length-1)):t<s.length-1&&S(this.offsetHeight*(t+1)/(s.length-1))}}),{onload:function(e){e?(t.showLoading(),Promise.all([fetch(d,{method:"post",body:"ServiceID=Z002"}).then(function(e){return e.json()}),fetch(d,{method:"post",body:"ServiceID=Z003&param=["+encodeURIComponent('"A股"')+"]"}).then(function(e){return e.json()}).then(function(e){var t=e.Result;return caches.open("chart").then(function(e){return e.match("/data").then(function(n){return n?n.json().then(function(n){return fetch(d,{method:"post",body:'ServiceID=Z001&param=["'+Object.keys(t).join(";")+'",'+n.days[n.days.length-1]+"]"}).then(function(e){return e.json()}).then(function(s){for(var o=1;o<s.Result.length;o++){o>1&&n.days.push(s.Result[o][0]);for(var a=1;a<s.Result[o].length;a++)null!==s.Result[o][a]&&(n.base[s.Result[0][a]]||(n.base[s.Result[0][a]]=[t[s.Result[0][a]],n.days.length-1]),1===o&&n.base[s.Result[0][a]].length>2?n.base[s.Result[0][a]].splice(-1,1,s.Result[o][a]):n.base[s.Result[0][a]].push(s.Result[o][a]))}return s.Result.length>2&&e.put("/data",new Response(JSON.stringify(n))),n})}):fetch(d,{method:"post",body:'ServiceID=Z001&param=["'+Object.keys(t).join(";")+'"]'}).then(function(e){return e.json()}).then(function(n){for(var s={days:[],base:{}},o=1;o<n.Result.length;o++){for(var a=1;a<n.Result[o].length;a++)null!==n.Result[o][a]&&(s.base[n.Result[0][a]]||(s.base[n.Result[0][a]]=[t[n.Result[0][a]],s.days.length]),s.base[n.Result[0][a]].push(n.Result[o][a]));s.days.push(n.Result[o][0])}return e.put("/data",new Response(JSON.stringify(s))),s})})})})]).then(function(e){r=e[1].days;var n=e[0].Result,s=e[1].base,o=Object.keys(n),a={0:Array(r.length).fill(0),1:Array(r.length).fill(0),2:Array(r.length).fill(0)},c=[[.25,.75,.25,.75],[.25,.25,.25,.75],[.75,.25,.25,.75]];o.sort(function(e,t){var n=s[e],o=s[t];return o[o.length-1][2]-n[n.length-1][2]});for(var u=0;u<o.length;u++){var l=r.indexOf(n[o[u]][0]),d=s[o[u]],g=void 0;if(l>=0){h[o[u]]={data:[],cross:l-d[1],name:d[0],offset:d[1]},v[o[u]]={starts:[],colors:[]};for(var m=2;m<d.length;m++)a[d[m][3]][m+d[1]-2]++,g!==d[m][3]&&(g=d[m][3],v[o[u]].starts.push(h[o[u]].data.length),v[o[u]].colors.push(c[d[m][3]])),h[o[u]].data.push(d[m][0]*d[m][1]),m===d.length-1&&(f[d[m][3]][0][o[u]]=h[o[u]],f[d[m][3]][1][o[u]]=v[o[u]],h[o[u]].color=R(d[m][2]),h[o[u]].rate=d[m][1])}}for(var p=0;p<r.length;p++){var b=a[0][p]+a[1][p]+a[2][p];a[0][p]/=b,a[1][p]/=b,a[2][p]/=b}i.clear(),i.add(a),i.setSections({0:{starts:[0],colors:[c[0]]},1:{starts:[0],colors:[c[1]]},2:{starts:[0],colors:[c[2]]}}),y(),t.hideLoading()})):y()}};function y(){t.location.args.c>=0&&t.location.args.c<f.length?(o=f[t.location.args.c][0],a=f[t.location.args.c][1],i.selected=t.location.args.c):(o=h,a=v,i.selected=undefined),s=Object.keys(o),l.clear(),l.add(o),l.setSections(a),m.clearRect(0,0,1,m.canvas.height),m.canvas.height=s.length;for(var e=0;e<s.length;e++)m.fillStyle=o[s[e]].color,m.fillRect(0,e,1,1);S(0)}function R(e){return"rgb("+t(e)+","+t(e>.5?1-e:e)+","+t(1-e)+")";function t(e){return Math.round(255*e)}}function b(e){if(e.button===0&&s.length){m.canvas.removeEventListener("mousedown",b);m.canvas.addEventListener("mousemove",t);document.addEventListener("mouseup",n);t(e)}function t(e){if(e.offsetY>=0&&e.offsetY<=m.canvas.offsetHeight){S(e.offsetY)}}function n(e){if(e.button===0){m.canvas.addEventListener("mousedown",b);m.canvas.removeEventListener("mousemove",t);document.removeEventListener("mouseup",n)}}}function S(e){p.style.top=36.5+e+"px",l.selected=s[Math.round(e/m.canvas.offsetHeight*(s.length-1))],g.innerHTML=o[l.selected].name+"<span>"+l.selected+"</span>",l.onrangechange()}function L(e){return Math.round(864e5*e)-2209190743e3}});