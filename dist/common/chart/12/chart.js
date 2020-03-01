"use strict";define(function(){var t=Symbol("labeling"),h=Symbol("cursor"),s=Symbol("oldcursor"),e=Symbol("width"),r=Symbol("height"),o=Symbol("points"),a=Symbol("length"),f=Symbol("cursorColor"),n=Symbol("cursorTextColor"),l=Symbol("selectedColor"),u=Symbol("backgroundColor"),v=Symbol("outlineColor"),y=Symbol("lineColor"),m=Symbol("gridColor"),N=Symbol("rectColor"),b=Symbol("textColor"),S=Symbol("paiting"),p=Symbol("canvas2d"),I=Symbol("canvas3d"),O=Symbol("gl"),c=Symbol("ground"),A=Symbol("HV"),x=Symbol("MAX"),R=Symbol("COLOR"),P=Symbol("POSITION"),L=Symbol("OFFSET"),E=Symbol("OUTLINE"),w=Symbol("WV"),g=Symbol("X"),T=Symbol("Y"),C=Symbol("paddingX"),B=Symbol("paddingY"),F=Symbol("paddingLeft"),X=Symbol("fontSize"),M=Symbol("oldbegin"),D=Symbol("oldend"),U=Symbol("stage"),Y=Symbol("begin"),V=Symbol("end"),H=Symbol("cross"),W=Symbol("selected"),K=Symbol("max"),z=Symbol("min"),j=Symbol("lines"),q=Symbol("minLen"),G=Symbol("mouseListener");function k(t,i,h){this[B]=40,this[C]=60,this[F]=50,this[X]=8,this[f]=[1,0,0,1],this[n]=[1,1,1,1],this[u]=[1,1,1,1],this[v]=[1,1,1,1],this[l]=[0,0,0,1],this[y]=[[.75,.75,.75,1]],this[m]=[.75,.75,1,1],this[N]=[0,0,0,1],this[b]=[0,0,0,1],i||(this[H]=NaN),this[j]={},this[U]=t.appendChild(document.createElement("div")),this[U].style.width=this[U].style.height="100%",this[U].style.overflow="hidden",this[U].style.position="relative",this[U].addEventListener("contextmenu",function(t){t.preventDefault()}),this[p]=this[U].appendChild(document.createElement("canvas")),this[p].style.display="block",this[p].style.width=this[p].style.height="100%",this[I]=this[U].appendChild(document.createElement("canvas")),this[I].style.position="absolute",this[I].style.left=this[F]+"px",this[I].style.top=this[X]+"px",this[I].style.outline="none",this[I].tabIndex=0,h||(this[I].style.cursor="grab",this[G]=function(t){var i,h,s=function(t){if(2===h)o.call(this,t.offsetX);else{var s=J.call(this),e=(i-t.offsetX)%(s/(this[V]-this[Y]));this.moveCoordBy(Math.round((i-t.offsetX-e)*(this[V]-this[Y])/s))&&(i=t.offsetX-e)}}.bind(this),e=function(t){t.button===h&&(this[I].style.cursor="grab",this[I].removeEventListener("mousemove",s),this[I].ownerDocument.removeEventListener("mouseup",e),this[I].addEventListener("mousedown",this[G]))}.bind(this),r=function(){this[I].removeEventListener("mousedown",this[G]),this[I].addEventListener("mousemove",s),this[I].ownerDocument.addEventListener("mouseup",e)},o=function(t){this.cursor=this[Y]+Math.round(t*(this[V]-this[Y])/J.call(this))};0===(h=t.button)?(i=t.offsetX,this[I].style.cursor="grabbing",r.call(this)):2===h&&this[W]!==undefined&&(this[I].style.cursor="crosshair",r.call(this),o.call(this,t.offsetX))}.bind(this),this[I].addEventListener("keydown",function(t){37==t.keyCode?(t.altKey?this.cursor-=1:this.moveCoordBy(1),t.preventDefault()):39==t.keyCode?(t.altKey?this.cursor+=1:this.moveCoordBy(-1),t.preventDefault()):38==t.keyCode?(this.zoomCoordBy(-1,t.altKey),t.preventDefault()):40==t.keyCode&&(this.zoomCoordBy(1,t.altKey),t.preventDefault())}.bind(this)),this[I].addEventListener("mousedown",this[G]),this[I].addEventListener("wheel",function(t){var i=Math.abs(t.deltaX),h=Math.abs(t.deltaY);t.preventDefault(),i>h?this.moveCoordBy(Math.round(t.deltaX)):h>i&&this.zoomCoordBy(t.deltaY,t.altKey)}.bind(this))),this[c]=this[p].getContext("2d"),this[O]=this[I].getContext("webgl",{alpha:!0,premultipliedAlpha:!1,antialias:!0,powerPreference:"high-performance",depth:!1,preserveDrawingBuffer:!0});var s=this[O].createShader(this[O].VERTEX_SHADER),e=this[O].createShader(this[O].FRAGMENT_SHADER),r=this[O].createProgram();if(this[O].enable(this[O].BLEND),this[O].blendFunc(this[O].SRC_ALPHA,this[O].ONE_MINUS_SRC_ALPHA),this[O].shaderSource(s,"attribute vec4 POSITION;\n\t\tattribute vec4 COLOR;\n\t\tattribute float WV;\n\t\tattribute float HV;\n\t\tattribute float MAX;\n\t\tattribute float OFFSET;\n\t\tattribute float OUTLINE;\n\t\tattribute float X;\n\t\tattribute float Y;\n\t\tvarying vec4 color;\n\t\tvoid main(void) {\n\t\t\tif (COLOR.x >= 0.0 && COLOR.y >= 0.0 && COLOR.z >= 0.0 && COLOR.w >= 0.0) {\n\t\t\t\tcolor = COLOR;\n\t\t\t} else {\n\t\t\t\tcolor.x = mod(POSITION.z, 256.0);\n\t\t\t\tcolor.y = (POSITION.z - color.x) / 256.0;\n\t\t\t\tcolor.z = mod(POSITION.w, 256.0);\n\t\t\t\tcolor.w = (POSITION.w - color.z) / 256.0;\n\t\t\t\tcolor /= 255.0;\n\t\t\t\tif (COLOR.w >= 0.0) {\n\t\t\t\t\tcolor.w = COLOR.w;\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (POSITION.y < 0.0 || POSITION.y >= 0.0) {\n\t\t\t\tfloat x = (POSITION.x + OFFSET) / WV;\n\t\t\t\tfloat y = (POSITION.y - MAX) / HV;\n\t\t\t\tif (OUTLINE == 1.0) {\n\t\t\t\t\ty = (Y * y + 1.0) / Y;\n\t\t\t\t} else if (OUTLINE == 2.0) {\n\t\t\t\t\ty = (Y * y - 1.0) / Y;\n\t\t\t\t} else if (OUTLINE == 3.0) {\n\t\t\t\t\tx = (X * x + 1.0) / X;\n\t\t\t\t} else if (OUTLINE == 4.0) {\n\t\t\t\t\tx = (X * x - 1.0) / X;\n\t\t\t\t}\n\t\t\t\tgl_Position = vec4(x * 2.0 - 1.0, y * 2.0 + 1.0, 0.0, 1.0);\n\t\t\t} else if (X != 0.0) {\n\t\t\t\tgl_Position = vec4(X * 2.0 / WV - 1.0, POSITION.x, 0.0, 1.0);\n\t\t\t} else if (Y != 0.0) {\n\t\t\t\tgl_Position = vec4(POSITION.x, Y * -2.0 + 1.0, 0.0, 1.0);\n\t\t\t} else if (POSITION.x == 1.0) {\n\t\t\t\tgl_Position = vec4(1.0, -1.0, 0.0, 1.0);\n\t\t\t} else if (POSITION.x == 2.0) {\n\t\t\t\tgl_Position = vec4(1.0, 1.0, 0.0, 1.0);\n\t\t\t} else if (POSITION.x == 3.0) {\n\t\t\t\tgl_Position = vec4(-1.0, 1.0, 0.0, 1.0);\n\t\t\t} else {\n\t\t\t\tgl_Position = vec4(-1.0, -1.0, 0.0, 1.0);\n\t\t\t}\n\t\t}"),this[O].shaderSource(e,"precision mediump float;\n\t\tvarying vec4 color;\n\t\tvoid main(void) {\n\t\t\tgl_FragColor = color;\n\t\t}"),this[O].compileShader(s),this[O].compileShader(e),this[O].attachShader(r,s),this[O].attachShader(r,e),this[O].linkProgram(r),this[O].useProgram(r),this[P]=this[O].getAttribLocation(r,"POSITION"),this[w]=this[O].getAttribLocation(r,"WV"),this[A]=this[O].getAttribLocation(r,"HV"),this[x]=this[O].getAttribLocation(r,"MAX"),this[L]=this[O].getAttribLocation(r,"OFFSET"),this[E]=this[O].getAttribLocation(r,"OUTLINE"),this[g]=this[O].getAttribLocation(r,"X"),this[T]=this[O].getAttribLocation(r,"Y"),this[R]=this[O].getAttribLocation(r,"COLOR"),this[O].bindBuffer(this[O].ARRAY_BUFFER,this[O].createBuffer()),this[O].vertexAttribPointer(this[P],4,this[O].FLOAT,!1,0,0),this[O].enableVertexAttribArray(this[P]),self.ResizeObserver)new ResizeObserver(Z.bind(this)).observe(this[U]);else{var o=this[U].insertBefore(document.createElement("iframe"),this[p]);o.style.border="none",o.style.display="block",o.style.position="absolute",o.style.top=o.style.left=0,o.style.width=o.style.height="100%",o.style.visibility="hidden",o.contentWindow.addEventListener("resize",Z.bind(this))}$.call(this),_.call(this)}return k.prototype.setData=function(t){if(Number.isNaN(this[H]))for(var i in t)if(t[i]){if(t[i].data.length>1){this[j][i]={data:t[i].data,offset:0|t[i].offset,colors:t[i].colors||this[y],visible:!("visible"in t[i])||t[i].visible,tmax:-Infinity,tmin:Infinity};for(var h=0;h<t[i].data.length;h++)r.call(this,i,h)}}else delete this[j][i];else for(var s in t)if(t[s]){if(t[s].data.length>1&&t[s].cross>=0&&t[s].cross<t[s].data.length){this[j][s]={data:[],cross:t[s].cross,colors:t[s].colors||this[y],visible:!("visible"in t[s])||t[s].visible,tmax:-Infinity,tmin:Infinity};for(var e=0;e<t[s].data.length;e++)this[j][s].data[e]=(t[s].data[e]-t[s].data[t[s].cross])/(e<t[s].cross?t[s].data[e]:t[s].data[t[s].cross]),(this[j][s].data[e]>1||this[j][s].data[e]<-1)&&(this[j][s].data[e]=Math.cbrt(this[j][s].data[e])),r.call(this,s,e)}}else delete this[j][s];function r(t,i){this[j][t].tmax<this[j][t].data[i]&&(this[j][t].tmax=this[j][t].data[i],this[j][t].tmaxi=i),this[j][t].tmin>this[j][t].data[i]&&(this[j][t].tmin=this[j][t].data[i],this[j][t].tmini=i)}_.call(this)},k.prototype.setVisibility=function(t){for(var i in t)this[j][i]&&(this[j][i].visible=t[i]);_.call(this,"buffing")},k.prototype.setColor=function(t){for(var i in t)this[j][i]&&(this[j][i].colors=t[i]?t[i]:this[y]);_.call(this,"buffing")},k.prototype.remove=function(t){for(var i,h=0;h<t.length;h++)this[j].hasOwnProperty(t[h])&&(i=!0,delete this[j][t[h]]);if(i)return this[W]===undefined||this[j].hasOwnProperty(this[W])||(this[W]=undefined),_.call(this),!0},k.prototype.clear=function(){if(this[a])return this[j]={},this[W]=undefined,_.call(this),!0},k.prototype.center=function(){if(!Number.isNaN(this[h])){var t=Math.ceil((this[V]-this[Y])/2),i=this[h]-t,s=this[h]+t;return i<0?(i=0,s=2*this[h]):s>=this[a]&&(s=this[a]-1,i=2*this[h]-s),this.setRange(i,s)}},k.prototype.setRange=function(t,i){var h=tt.call(this,t,i);if(h[0]!==this[Y]||h[1]!==this[V])return this[Y]=h[0],this[V]=h[1],ht.call(this),!0},k.prototype.moveCoordBy=function(t){if(this[Y]+t<0?t=-this[Y]:this[V]+t>this[a]-1&&(t=this[a]-1-this[V]),t)return this[Y]+=t,this[V]+=t,ht.call(this),!0},k.prototype.zoomCoordBy=function(t,i){var s,e=this[V]-this[Y];if(i&&(t=e*t/100),(s=e+2*Math[t>0?"ceil":"floor"](t/2))<this[q]?s=this[q]:s>this[a]-1&&(s=this[a]-1),s!==e){if(this[h]>=this[Y]&&this[h]<=this[V]){var r=s-e,o=this[V]-this[Y];this[Y]+=Math.round(r*(this[Y]-this[h])/o),this[V]+=Math.round(r*(this[V]-this[h])/o)}else{var f=(s-e)/2;this[Y]-=Math.ceil(f),this[V]+=Math.floor(f)}return this[Y]<0?(this[V]-=this[Y],this[Y]=0):this[V]>this[a]-1&&(this[Y]+=this[a]-1-this[V],this[V]=this[a]-1),ht.call(this),!0}},k.prototype.copy=function(){var t=document.createElement("canvas"),i=t.getContext("2d");return t.width=this[p].width,t.height=this[p].height,i.drawImage(this[p],0,0,this[p].width,this[p].height),this[O].finish(),i.drawImage(this[I],0,0,this[I].width,this[I].height,this[F]*devicePixelRatio,this[X]*devicePixelRatio/2,this[I].width,this[I].height),t},Object.defineProperties(k.prototype,{points:{get:function(){return this[o]}},length:{get:function(){return this[a]}},cross:{get:function(){return this[H]}},labeling:{get:function(){return this[t]},set:function(i){this[t]=i,this[h]>=this[Y]&&this[h]<=this[V]&&ht.call(this)}},cursor:{get:function(){return this[h]},set:function(t){t=it.call(this,t),this[h]!==t&&(this[h]=t,ht.call(this))}},begin:{get:function(){return this[Y]},set:function(t){this.setRange(t,this[V])}},end:{get:function(){return this[V]},set:function(t){this.setRange(this[Y],t)}},selected:{get:function(){return this[W]},set:function(t){var i;if(t=String(t),this[j].hasOwnProperty(t)){if(this[W]===t)return;i=!this[j][t].visible||this[W]&&!this[j][this[W]].visible,this[W]=t}else this[W]=undefined;i?_.call(this,"buffering"):(this[h]=it.call(this,this[h]),ht.call(this))}},paddingX:{get:function(){return this[C]},set:function(t){this[C]=t,Z.call(this)}},paddingY:{get:function(){return this[B]},set:function(t){this[B]=t,ht.call(this)}},paddingLeft:{get:function(){return this[F]},set:function(t){this[F]=t,this[I].style.left=t+"px",Z.call(this)}},fontSize:{get:function(){return this[X]},set:function(t){this[X]=t,this[I].style.top=t+"px",Z.call(this)}},selectedColor:{get:function(){return this[l]},set:function(t){this[l]=t,ht.call(this)}},backgroundColor:{get:function(){return this[u]},set:function(t){this[u]=t,ht.call(this)}},lineColor:{get:function(){return this[y][0]},set:function(t){this[y][0]=t,_.call(this,"indexing")}},cursorColor:{get:function(){return this[f]},set:function(t){this[f]=t,(this[h]>=this[Y]&&this[h]<=this[V]||this[j][this[W]].data[i]>=this[z]&&this[j][this[W]].data[i]<=this[K])&&ht.call(this)}},gridColor:{get:function(){return this[m]},set:function(t){this[m]=t,ht.call(this)}},rectColor:{get:function(){return this[N]},set:function(t){this[N]=t,ht.call(this)}},textColor:{get:function(){return this[b]},set:function(t){this[b]=t,ht.call(this)}}}),k;function J(){return this[e]-this[F]-this[C]/2}function Q(){return this[r]-3*this[X]}function Z(){$.call(this),d.call(this),this.setRange(this[Y],this[V])||ht.call(this)}function $(){this[e]=this[U].clientWidth,this[r]=this[U].clientHeight;var t=J.call(this),i=Q.call(this);this[p].width=this[e]*devicePixelRatio,this[p].height=this[r]*devicePixelRatio,this[I].width=t*devicePixelRatio,this[I].height=i*devicePixelRatio,this[I].style.width=t+"px",this[I].style.height=i+"px",this[c].scale(devicePixelRatio,devicePixelRatio),this[O].viewport(0,0,this[I].width,this[I].height)}function d(){this[q]=Math.min(Math.floor(J.call(this)/this[C]),this[a]-1)}function _(t){if("indexing"!==t){if(this[o]=this[a]=0,Number.isNaN(this[H])){var i=Infinity;for(var e in this[j])(this[j][e].visible||this[W]===e)&&i>this[j][e].offset&&(i=this[j][e].offset),this[o]+=this[j][e].data.length;for(var r in this[j])if(this[j][r].offset-=i,this[j][r].visible||this[W]===r){var f=this[j][r].offset+this[j][r].data.length;this[a]<f&&(this[a]=f)}}else{for(var n in this[H]=0,this[j])this[j][n].visible&&this[H]<this[j][n].cross&&(this[H]=this[j][n].cross),this[o]+=this[j][n].data.length;for(var l in this[j])if(this[j][l].offset=this[H]-this[j][l].cross,this[j][l].visible){var u=this[j][l].offset+this[j][l].data.length;this[a]<u&&(this[a]=u)}}d.call(this),this[h]=it.call(this,this[h]);var v=tt.call(this,this[Y],this[V]);this[Y]=v[0],this[V]=v[1],this[M]=this[D]=this[s]=undefined}if("buffering"!==t){var y=16,m=new Float32Array(4*this[o]+y);for(var N in m.set([-1,NaN,NaN,NaN,1,NaN,NaN,NaN,2,NaN,NaN,NaN,3,NaN,NaN,NaN]),this[j])for(var b=this[j][N],S=void 0,p=0;p<b.data.length;p++)b.colors[p]&&(S=st(b.colors[p],!0)),m[y++]=p,m[y++]=b.data[p],m[y++]=S[0],m[y++]=S[1];this[O].bufferData(this[O].ARRAY_BUFFER,m,this[O].STATIC_DRAW)}ht.call(this)}function tt(t,i){return this[a]>1?[t=Math.max(0,Math.min(t,this[a]-this[q])),Math.max(t+this[q]-1,Math.min(i,this[a]-1))]:[-Infinity,Infinity]}function it(t){return this[W]===undefined?this[H]:(t=Number(t),Number.isNaN(t)?t=this[H]:t<this[j][this[W]].offset?t=this[j][this[W]].offset:t>=this[j][this[W]].offset+this[j][this[W]].data.length&&(t=this[j][this[W]].offset+this[j][this[W]].data.length-1),t)}function ht(){this[S]||(this[S]=requestAnimationFrame(function(){var i=this,o=this[Y]!==this[M]||this[V]!==this[D];if(this[O].clearColor(this[u][0],this[u][1],this[u][2],1),this[O].clear(this[O].COLOR_BUFFER_BIT|this[O].DEPTH_BUFFER_BIT|this[O].STENCIL_BUFFER_BIT),this[c].clearRect(0,0,this[e],this[r]),this[a]>1){var p=function(i){var h=i-this[Y];et.push({x:h}),ot.push({v:h*tt,text:Number.isNaN(this[H])?this[t]?this[t](i):i:i-this[H]})},I=function(i,h){et.push({y:i}),at.push({v:i*$,text:Number.isNaN(this[H])?this[t]?this[t](h,!0):Math.round(100*h)/100:Math.round(1e3*(h>1||h<-1?Math.pow(h,3):h))/10+"%"})},P=function(t){for(var i=0;i<t.length;i++)t[i].hasOwnProperty("x")?(this[O].vertexAttrib1f(this[T],0),this[O].vertexAttrib1f(this[g],t[i].x)):(this[O].vertexAttrib1f(this[g],0),this[O].vertexAttrib1f(this[T],t[i].y)),this[O].drawArrays(this[O].LINE_STRIP,0,2)},U=function(t,i){if(this[c].font=this[X]+"px monospace",i){var h=$+1.5*this[X];this[c].textAlign="center",this[c].textBaseline="top",this[c].fillStyle=st(this[b]);for(var s=0;s<t.length;s++)t[s].cur&&(this[c].fillStyle=st(this[f]),this[c].fillRect(t[s].v+this[F]-this[C]/2,h-this[X]/2,this[C],2*this[X]),this[c].font="bold "+this[X]+"px monospace",this[c].fillStyle=st(this[n])),this[c].fillText(t[s].text,t[s].v+this[F],h,this[F]-this[X])}else{var e=this[F]-this[X]/2;this[c].textAlign="right",this[c].textBaseline="middle",this[c].fillStyle=st(this[b]);for(var r=0;r<t.length;r++)t[r].cur&&(this[c].fillStyle=st(this[f]),this[c].fillRect(0,t[r].v,this[F],2*this[X]),this[c].font="bold "+this[X]+"px monospace",this[c].fillStyle=st(this[n])),this[c].fillText(t[r].text,e,t[r].v+this[X],this[C]-this[X])}};if(o){var q=function(t){var h=i[j][t];if(h.visible||i[W]===t){var s,e,r=function(t,i,s,e){if(s&&e)for(var r=t;r<=i;r++){var o=h.data[r];h.max<o&&(h.max=o,h.maxi=r),h.min>o&&(h.min=o,h.mini=r)}else if(s)for(var a=t;a<=i;a++){var f=h.data[a];h.max<f&&(h.max=f,h.maxi=a)}else if(e)for(var n=t;n<=i;n++){var l=h.data[n];h.min>l&&(h.min=l,h.mini=n)}},o=Math.max(i[Y]-h.offset,0),a=Math.min(i[V]-h.offset,h.data.length-1),f=Math.max(i[M]-h.offset,0),n=Math.min(i[D]-h.offset,h.data.length-1);if(o!==f||a!==n)if(a>0&&o<h.data.length-1)h.tmaxi>=o&&h.tmaxi<=a?(h.max=h.tmax,h.maxi=h.tmaxi):s=!0,h.tmini>=o&&h.tmini<=a?(h.min=h.tmin,h.mini=h.tmini):e=!0,(s||e)&&(o>f&&a<n?(s&&(h.maxi<o||h.maxi>a)&&(h.max=-Infinity),e&&(h.mini<o||h.mini>a)&&(h.min=Infinity)):o>f&&o<n?(s&&h.maxi<o&&(h.max=-Infinity),e&&h.mini<o&&(h.min=Infinity),r.call(i,n+1,a,s&&h.max!==-Infinity,e&&h.min!==Infinity)):a>f&&a<n?(s&&h.maxi>a&&(h.max=-Infinity),e&&h.mini>a&&(h.min=Infinity),r.call(i,o,f-1,s&&h.max!==-Infinity,e&&h.min!==Infinity)):o<=f&&a>=n?(r.call(i,o,f-1,s,e),r.call(i,n+1,a,s,e)):(s&&(h.max=-Infinity),e&&(h.min=Infinity)),r.call(i,o,a,h.max===-Infinity,h.min===Infinity));else h.max=-Infinity,h.min=Infinity,h.maxi=h.mini=NaN}};for(var G in this[j])q(G);for(var G in this[K]=-Infinity,this[z]=Infinity,this[j]){var k=this[j][G];(k.visible||this[W===G])&&(this[K]<k.max&&(this[K]=k.max),this[z]>k.min&&(this[z]=k.min))}}var Z=J.call(this),$=Q.call(this),d=this[V]-this[Y],_=this[K]-this[z],tt=Z/d,it=this[K]/_,ht=Math.ceil(this[C]/tt),et=[],rt=[],ot=[{v:0,text:Number.isNaN(this[H])?this[t]?this[t](this[Y]):this[Y]:this[Y]-this[H]},{v:Z,text:Number.isNaN(this[H])?this[t]?this[t](this[V]):this[V]:this[V]-this[H]}],at=[{v:0,text:Number.isNaN(this[H])?this[t]?this[t](this[K],!0):this[K]:Math.round(1e3*(this[K]>1||this[K]<-1?Math.pow(this[K],3):this[K]))/10+"%"},{v:$,text:Number.isNaN(this[H])?this[t]?this[t](this[z],!0):this[z]:Math.round(1e3*(this[z]>1||this[z]<-1?Math.pow(this[z],3):this[z]))/10+"%"}];if(this[H]>=this[Y]&&this[H]<=this[V]){for(var ft=Math.floor((this[V]-this[H])/ht),nt=(this[V]-this[H])/ft,lt=1;lt<ft;lt++)p.call(this,this[H]+Math.round(lt*nt));ft=Math.floor((this[H]-this[Y])/ht),nt=(this[H]-this[Y])/ft;for(var ut=1;ut<ft;ut++)p.call(this,this[H]-Math.round(ut*nt));if(this[H]!==this[Y]&&this[H]!==this[V]){var vt=this[H]-this[Y];et.push({x:vt}),ot.push({v:vt*tt,text:0})}}else for(var yt=Math.floor((this[V]-this[Y])/ht),mt=(this[V]-this[Y])/yt,Nt=1;Nt<yt;Nt++)p.call(this,this[Y]+Math.round(Nt*mt));if(Number.isNaN(this[H])||this[K]<0||this[z]>0)for(var bt=Math.floor($/this[B]),St=1;St<bt;St++)I.call(this,1-St/bt,this[z]+(this[K]-this[z])*St/bt);else{for(var pt=Math.floor(it*$/this[B]),It=1;It<pt;It++)I.call(this,it-it*It/pt,this[K]*It/pt);pt=Math.floor((1-it)*$/this[B]);for(var Ot=1;Ot<pt;Ot++)I.call(this,it+(1-it)*Ot/pt,this[z]*Ot/pt);0!==this[K]&&0!==this[z]&&(et.push({y:it}),at.push({v:it*$,text:"0%"}))}if(!Number.isNaN(this[h]))if(this[W]===undefined){if(this[h]>=this[Y]&&this[h]<=this[V]){var ct=this[h]-this[Y];rt.push({x:ct}),ot.push({v:ct*tt,text:0,cur:!0})}rt.push({y:it}),at.push({v:it*$,text:"0%",cur:!0})}else{var At=this[h]-this[j][this[W]].offset;if(this[h]>=this[Y]&&this[h]<=this[V]){var xt=this[h]-this[Y];rt.push({x:xt}),ot.push({v:xt*tt,text:Number.isNaN(this[H])?this[t]?this[t](this[h]):this[h]:this[t]?this[t](At):this[h]-this[H],cur:!0})}if(this[j][this[W]].data[At]>=this[z]&&this[j][this[W]].data[At]<=this[K]){var Rt=(this[K]-this[j][this[W]].data[At])/_;rt.push({y:Rt}),at.push({v:Rt*$,text:Number.isNaN(this[H])?this[t]?this[t](this[j][this[W]].data[At],!0):this[j][this[W]].data[At]:this[t]?this[t](At,!0):Math.round(1e3*(this[j][this[W]].data[At]>1||this[j][this[W]].data[At]<-1?Math.pow(this[j][this[W]].data[At],3):this[j][this[W]].data[At]))/10+"%",cur:!0})}}var Pt,Lt=4;for(var Et in this[O].vertexAttrib1f(this[w],d),this[O].vertexAttrib1f(this[A],_),this[O].vertexAttrib1f(this[x],this[K]),this[O].vertexAttrib4f(this[R],NaN,NaN,NaN,NaN),this[j]){var wt=this[j][Et];if(wt.visible)if(Et===this[W])Pt=Lt;else if(wt.offset<this[V]&&wt.data.length-1>this[Y]-wt.offset){var gt=Math.max(this[Y]-wt.offset,0);this[O].vertexAttrib1f(this[L],wt.offset-this[Y]),this[O].drawArrays(this[O].LINE_STRIP,Lt+gt,Math.min(this[V]-wt.offset+1,wt.data.length)-gt)}Lt+=wt.data.length}if(this[O].vertexAttrib4f(this[R],this[m][0],this[m][1],this[m][2],this[m][3]),P.call(this,et),this[O].vertexAttrib4f(this[R],this[f][0],this[f][1],this[f][2],this[f][3]),P.call(this,rt),this[W]!==undefined&&this[j][this[W]].offset<this[V]&&this[j][this[W]].data.length-1>this[Y]-this[j][this[W]].offset){var Tt=this[j][this[W]],Ct=Math.max(this[Y]-Tt.offset,0),Bt=Pt+Ct,Ft=Math.min(this[V]-Tt.offset+1,Tt.data.length)-Ct;this[O].vertexAttrib4f(this[R],this[v][0],this[v][1],this[v][2],this[v][3]),this[O].vertexAttrib1f(this[L],Tt.offset-this[Y]),this[O].vertexAttrib1f(this[g],Z*devicePixelRatio),this[O].vertexAttrib1f(this[T],$*devicePixelRatio);for(var Xt=1;Xt<=4;Xt++)this[O].vertexAttrib1f(this[E],Xt),this[O].drawArrays(this[O].LINE_STRIP,Bt,Ft);this[O].vertexAttrib1f(this[E],0),Tt.colors===this[y]?this[O].vertexAttrib4f(this[R],this[l][0],this[l][1],this[l][2],this[l][3]):this[O].vertexAttrib4f(this[R],NaN,NaN,NaN,1),this[O].drawArrays(this[O].LINE_STRIP,Bt,Ft)}U.call(this,ot,!0),U.call(this,at)}this[O].vertexAttrib1f(this[g],0),this[O].vertexAttrib1f(this[T],0),this[O].vertexAttrib4f(this[R],this[N][0],this[N][1],this[N][2],this[N][3]),this[O].drawArrays(this[O].LINE_LOOP,0,4),this[S]=0,this[M]=this[Y],this[D]=this[V],this.onpaitend&&this.onpaitend({type:"paitend"});o&&this.onrangechange&&this.onrangechange({type:"rangechange"});this[h]===this[s]||Number.isNaN(this[h])&&Number.isNaN(this[s])||(this[s]=this[h],this.oncursorchange&&this.oncursorchange({type:"cursorchange"}))}.bind(this)),this.onpaitbegin&&this.onpaitbegin({type:"paitbegin"}))}function st(t,i){return i?[Math.round(255*t[0])+256*Math.round(255*t[1]),Math.round(255*t[2])+256*Math.round(255*t[3])]:"rgba("+Math.round(255*t[0])+","+Math.round(255*t[1])+","+Math.round(255*t[2])+", "+t[3]+")"}});