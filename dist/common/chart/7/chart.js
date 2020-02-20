"use strict";define(function(){var t=Symbol("colorful"),s=Symbol("labeling"),h=Symbol("cursor"),e=Symbol("oldcursor"),a=Symbol("width"),n=Symbol("height"),o=Symbol("length"),r=Symbol("cursorColor"),l=Symbol("cursorBackgroundColor"),f=Symbol("selectedColor"),u=Symbol("backgroundColor"),c=Symbol("outlineColor"),m=Symbol("lineColor"),y=Symbol("gridColor"),d=Symbol("rectColor"),v=Symbol("textColor"),b=Symbol("paiting"),x=Symbol("canvas2d"),N=Symbol("canvas3d"),p=Symbol("gl"),g=Symbol("ground"),S=Symbol("HV"),I=Symbol("MAX"),O=Symbol("COLOR"),A=Symbol("POSITION"),M=Symbol("OFFSET"),E=Symbol("OUTLINE"),P=Symbol("WV"),R=Symbol("X"),T=Symbol("Y"),w=Symbol("paddingX"),L=Symbol("paddingY"),C=Symbol("paddingLeft"),B=Symbol("fontSize"),F=Symbol("oldbegin"),X=Symbol("oldend"),D=Symbol("stage"),U=Symbol("begin"),Y=Symbol("end"),V=Symbol("cross"),k=Symbol("selected"),H=Symbol("max"),W=Symbol("min"),K=Symbol("lines"),j=Symbol("minLen"),q=Symbol("mouseListener");function G(i,s,h){this[L]=40,this[w]=60,this[C]=50,this[B]=8,this[r]=[1,0,0,1],this[l]=[.75,.75,.75,1],this[f]=[0,0,0,1],this[u]=[1,1,1,1],this[c]=[0,0,0,.0625],this[m]=[.75,.75,.75,1],this[y]=[.75,.75,1,1],this[d]=[0,0,0,1],this[v]=[0,0,0,1],s||(this[V]=NaN),this[t]=!1,this[K]={},this[D]=i.appendChild(document.createElement("div")),this[D].style.width=this[D].style.height="100%",this[D].style.overflow="hidden",this[D].style.position="relative",this[D].addEventListener("contextmenu",function(t){t.preventDefault()}),this[x]=this[D].appendChild(document.createElement("canvas")),this[x].style.display="block",this[x].style.width=this[x].style.height="100%",this[N]=this[D].appendChild(document.createElement("canvas")),this[N].style.position="absolute",this[N].style.left=this[C]+"px",this[N].style.top=this[B]+"px",this[N].style.outline="none",this[N].tabIndex=0,h||(this[N].style.cursor="grab",this[q]=function(t){var i,s,h=function(t){if(2===s)n.call(this,t.offsetX);else{var h=J.call(this),e=(i-t.offsetX)%(h/(this[Y]-this[U]));this.moveCoordBy(Math.round((i-t.offsetX-e)*(this[Y]-this[U])/h))&&(i=t.offsetX-e)}}.bind(this),e=function(t){t.button===s&&(this[N].style.cursor="grab",this[N].removeEventListener("mousemove",h),this[N].ownerDocument.removeEventListener("mouseup",e),this[N].addEventListener("mousedown",this[q]))}.bind(this),a=function(){this[N].removeEventListener("mousedown",this[q]),this[N].addEventListener("mousemove",h),this[N].ownerDocument.addEventListener("mouseup",e)},n=function(t){this.cursor=this[U]+Math.round(t*(this[Y]-this[U])/J.call(this))};0===(s=t.button)?(i=t.offsetX,this[N].style.cursor="grabbing",a.call(this)):2===s&&this[k]!==undefined&&(this[N].style.cursor="crosshair",a.call(this),n.call(this,t.offsetX))}.bind(this),this[N].addEventListener("keydown",function(t){37==t.keyCode?(t.altKey?this.cursor-=1:this.moveCoordBy(1),t.preventDefault()):39==t.keyCode?(t.altKey?this.cursor+=1:this.moveCoordBy(-1),t.preventDefault()):38==t.keyCode?(this.zoomCoordBy(-1,t.altKey),t.preventDefault()):40==t.keyCode&&(this.zoomCoordBy(1,t.altKey),t.preventDefault())}.bind(this)),this[N].addEventListener("mousedown",this[q]),this[N].addEventListener("wheel",function(t){var i=Math.abs(t.deltaX),s=Math.abs(t.deltaY);t.preventDefault(),i>s?this.moveCoordBy(Math.round(t.deltaX)):s>i&&this.zoomCoordBy(t.deltaY,t.altKey)}.bind(this))),this[g]=this[x].getContext("2d"),this[p]=this[N].getContext("webgl",{alpha:!0,premultipliedAlpha:!1,antialias:!0,powerPreference:"high-performance",depth:!1,preserveDrawingBuffer:!0});var e=this[p].createShader(this[p].VERTEX_SHADER),a=this[p].createShader(this[p].FRAGMENT_SHADER),n=this[p].createProgram();if(this[p].shaderSource(e,"attribute vec2 POSITION;\n\t\tattribute float WV;\n\t\tattribute float HV;\n\t\tattribute float MAX;\n\t\tattribute float OFFSET;\n\t\tattribute float OUTLINE;\n\t\tattribute float X;\n\t\tattribute float Y;\n\t\tvoid main(void) {\n\t\t\tif (POSITION.y < 0.0 || POSITION.y >= 0.0) {\n\t\t\t\tfloat x = (POSITION.x + OFFSET) / WV;\n\t\t\t\tfloat y = (POSITION.y - MAX) / HV;\n\t\t\t\tif (OUTLINE == 1.0) {\n\t\t\t\t\ty = (Y * y + 0.5) / Y;\n\t\t\t\t} else if (OUTLINE == 2.0) {\n\t\t\t\t\ty = (Y * y - 0.5) / Y;\n\t\t\t\t} else if (OUTLINE == 3.0) {\n\t\t\t\t\tx = (X * x + 0.5) / X;\n\t\t\t\t} else if (OUTLINE == 4.0) {\n\t\t\t\t\tx = (X * x - 0.5) / X;\n\t\t\t\t}\n\t\t\t\tgl_Position = vec4(x * 2.0 - 1.0, y * 2.0 + 1.0, 0.0, 1.0);\n\t\t\t} else if (X != 0.0) {\n\t\t\t\tgl_Position = vec4(X * 2.0 / WV - 1.0, POSITION.x, 0.0, 1.0);\n\t\t\t} else if (Y != 0.0) {\n\t\t\t\tgl_Position = vec4(POSITION.x, Y * -2.0 + 1.0, 0.0, 1.0);\n\t\t\t} else if (POSITION.x == 1.0) {\n\t\t\t\tgl_Position = vec4(1.0, -1.0, 0.0, 1.0);\n\t\t\t} else if (POSITION.x == 2.0) {\n\t\t\t\tgl_Position = vec4(1.0, 1.0, 0.0, 1.0);\n\t\t\t} else if (POSITION.x == 3.0) {\n\t\t\t\tgl_Position = vec4(-1.0, 1.0, 0.0, 1.0);\n\t\t\t} else {\n\t\t\t\tgl_Position = vec4(-1.0, -1.0, 0.0, 1.0);\n\t\t\t}\n\t\t}"),this[p].shaderSource(a,"uniform lowp vec4 COLOR;\n\t\tvoid main(void) {\n\t\t\tgl_FragColor = COLOR;\n\t\t}"),this[p].compileShader(e),this[p].compileShader(a),this[p].attachShader(n,e),this[p].attachShader(n,a),this[p].linkProgram(n),this[p].useProgram(n),this[A]=this[p].getAttribLocation(n,"POSITION"),this[P]=this[p].getAttribLocation(n,"WV"),this[S]=this[p].getAttribLocation(n,"HV"),this[I]=this[p].getAttribLocation(n,"MAX"),this[M]=this[p].getAttribLocation(n,"OFFSET"),this[E]=this[p].getAttribLocation(n,"OUTLINE"),this[R]=this[p].getAttribLocation(n,"X"),this[T]=this[p].getAttribLocation(n,"Y"),this[O]=this[p].getUniformLocation(n,"COLOR"),this[p].bindBuffer(this[p].ARRAY_BUFFER,this[p].createBuffer()),this[p].vertexAttribPointer(this[A],2,this[p].FLOAT,!1,0,0),this[p].enableVertexAttribArray(this[A]),self.ResizeObserver)new ResizeObserver(Z.bind(this)).observe(this[D]);else{var o=this[D].insertBefore(document.createElement("iframe"),this[x]);o.style.border="none",o.style.display="block",o.style.position="absolute",o.style.top=o.style.left=0,o.style.width=o.style.height="100%",o.style.visibility="hidden",o.contentWindow.addEventListener("resize",Z.bind(this))}$.call(this),_.call(this)}return G.prototype.add=function(t){if(Number.isNaN(this[V]))for(var i in t){var s=Array.isArray(t[i])?t[i]:t[i].data;if(s.length>1){this[K][i]={data:s,offset:0|t[i].offset,tmax:-Infinity,tmin:Infinity};for(var h=0;h<s.length;h++)n.call(this,i,h)}}else for(var e in t)if(t[e].data.length>1&&t[e].cross>=0&&t[e].cross<t[e].data.length){this[K][e]={data:[],cross:t[e].cross,tmax:-Infinity,tmin:Infinity};for(var a=0;a<t[e].data.length;a++)this[K][e].data[a]=(t[e].data[a]-t[e].data[t[e].cross])/(a<t[e].cross?t[e].data[a]:t[e].data[t[e].cross]),(this[K][e].data[a]>1||this[K][e].data[a]<-1)&&(this[K][e].data[a]=Math.cbrt(this[K][e].data[a])),n.call(this,e,a)}function n(t,i){this[K][t].tmax<this[K][t].data[i]&&(this[K][t].tmax=this[K][t].data[i],this[K][t].tmaxi=i),this[K][t].tmin>this[K][t].data[i]&&(this[K][t].tmin=this[K][t].data[i],this[K][t].tmini=i)}_.call(this)},G.prototype.remove=function(t){for(var i,s=0;s<t.length;s++)this[K].hasOwnProperty(t[s])&&(i=!0,delete this[K][t[s]]);if(i)return this[k]===undefined||this[K].hasOwnProperty(this[k])||(this[k]=undefined),_.call(this),!0},G.prototype.clear=function(){if(this[o])return this[K]={},this[k]=undefined,_.call(this),!0},G.prototype.setSections=function(i){var s=this[t];for(var h in i)this[K].hasOwnProperty(h)&&(this[K][h].starts=i[h].starts,this[K][h].colors=i[h].colors,this[k]===h&&(s=!0));if(s)return st.call(this),!0},G.prototype.center=function(){if(!Number.isNaN(this[h])){var t=Math.ceil((this[Y]-this[U])/2),i=this[h]-t,s=this[h]+t;return i<0?(i=0,s=2*this[h]):s>=this[o]&&(s=this[o]-1,i=2*this[h]-s),this.setRange(i,s)}},G.prototype.setRange=function(t,i){var s=tt.call(this,t,i);if(s[0]!==this[U]||s[1]!==this[Y])return this[U]=s[0],this[Y]=s[1],st.call(this),!0},G.prototype.moveCoordBy=function(t){if(this[U]+t<0?t=-this[U]:this[Y]+t>this[o]-1&&(t=this[o]-1-this[Y]),t)return this[U]+=t,this[Y]+=t,st.call(this),!0},G.prototype.zoomCoordBy=function(t,i){var s,e=this[Y]-this[U];if(i&&(t=e*t/100),(s=e+2*Math[t>0?"ceil":"floor"](t/2))<this[j]?s=this[j]:s>this[o]-1&&(s=this[o]-1),s!==e){if(this[h]>=this[U]&&this[h]<=this[Y]){var a=s-e;this[U]+=Math.round(a*(this[U]-this[h])/(this[Y]-this[U])),this[Y]+=Math.round(a*(this[Y]-this[h])/(this[Y]-this[U]))}else{var n=(s-e)/2;this[U]-=Math.ceil(n),this[Y]+=Math.floor(n)}return this[U]<0?(this[Y]-=this[U],this[U]=0):this[Y]>this[o]-1&&(this[U]+=this[o]-1-this[Y],this[Y]=this[o]-1),st.call(this),!0}},G.prototype.copy=function(){var t=document.createElement("canvas"),i=t.getContext("2d");return t.width=this[x].width,t.height=this[x].height,i.drawImage(this[x],0,0,this[x].width,this[x].height),this[p].finish(),i.drawImage(this[N],0,0,this[N].width,this[N].height,this[C]*devicePixelRatio,this[B]*devicePixelRatio/2,this[N].width,this[N].height),t},Object.defineProperties(G.prototype,{length:{get:function(){return this[o]}},cross:{get:function(){return this[V]}},labeling:{get:function(){return this[s]},set:function(t){this[s]=t,this[h]>=this[U]&&this[h]<=this[Y]&&st.call(this)}},cursor:{get:function(){return this[h]},set:function(t){t=it.call(this,t),this[h]!==t&&(this[h]=t,st.call(this))}},begin:{get:function(){return this[U]},set:function(t){this.setRange(t,this[Y])}},end:{get:function(){return this[Y]},set:function(t){this.setRange(this[U],t)}},selected:{get:function(){return this[k]},set:function(t){if(t=String(t),this[K].hasOwnProperty(t)){if(this[k]===t)return;this[k]=t}else this[k]=undefined;this[h]=it.call(this,this[h]),st.call(this)}},paddingX:{get:function(){return this[w]},set:function(t){this[w]=t,Z.call(this)}},paddingY:{get:function(){return this[L]},set:function(t){this[L]=t,st.call(this)}},paddingLeft:{get:function(){return this[C]},set:function(t){this[C]=t,this[N].style.left=t+"px",Z.call(this)}},fontSize:{get:function(){return this[B]},set:function(t){this[B]=t,this[N].style.top=t+"px",Z.call(this)}},selectedColor:{get:function(){return this[f]},set:function(t){this[f]=t,st.call(this)}},backgroundColor:{get:function(){return this[u]},set:function(t){this[u]=t,st.call(this)}},lineColor:{get:function(){return this[m]},set:function(t){this[m]=t,st.call(this)}},cursorColor:{get:function(){return this[r]},set:function(t){this[r]=t,(this[h]>=this[U]&&this[h]<=this[Y]||this[K][this[k]].data[i]>=this[W]&&this[K][this[k]].data[i]<=this[H])&&st.call(this)}},gridColor:{get:function(){return this[y]},set:function(t){this[y]=t,st.call(this)}},rectColor:{get:function(){return this[d]},set:function(t){this[d]=t,st.call(this)}},textColor:{get:function(){return this[v]},set:function(t){this[v]=t,st.call(this)}},colorful:{get:function(){return this[t]},set:function(i){i=Boolean(i),this[t]!==i&&(this[t]=i,st.call(this))}}}),G;function J(){return this[a]-this[C]-this[w]/2}function Q(){return this[n]-3*this[B]}function Z(){$.call(this),z.call(this),this.setRange(this[U],this[Y])||st.call(this)}function $(){this[a]=this[D].clientWidth,this[n]=this[D].clientHeight;var t=J.call(this),i=Q.call(this);this[x].width=this[a]*devicePixelRatio,this[x].height=this[n]*devicePixelRatio,this[N].width=t*devicePixelRatio,this[N].height=i*devicePixelRatio,this[N].style.width=t+"px",this[N].style.height=i+"px",this[g].scale(devicePixelRatio,devicePixelRatio),this[p].viewport(0,0,this[N].width,this[N].height)}function z(){this[j]=Math.min(Math.floor(J.call(this)/this[w]),this[o]-1)}function _(){var t=this[o]=0;if(Number.isNaN(this[V])){var i=Infinity;for(var s in this[K])i>this[K][s].offset&&(i=this[K][s].offset);for(var a in this[K]){this[K][a].offset-=i;var n=this[K][a].offset+this[K][a].data.length;this[o]<n&&(this[o]=n),t+=this[K][a].data.length}}else{for(var r in this[V]=0,this[K])this[V]<this[K][r].cross&&(this[V]=this[K][r].cross),t+=this[K][r].data.length;for(var l in this[K]){this[K][l].offset=this[V]-this[K][l].cross;var f=this[K][l].offset+this[K][l].data.length;this[o]<f&&(this[o]=f)}}z.call(this),this[h]=it.call(this,this[h]);var u=tt.call(this,this[U],this[Y]);this[U]=u[0],this[Y]=u[1],this[F]=this[X]=this[e]=undefined;var c=new Float32Array(2*t+8);for(var m in c.set([-1,NaN,1,NaN,2,NaN,3,NaN]),t=8,this[K])for(var y=this[K][m],d=0;d<y.data.length;d++)c[t++]=d,c[t++]=y.data[d];this[p].bufferData(this[p].ARRAY_BUFFER,c,this[p].STATIC_DRAW),st.call(this)}function tt(t,i){return this[o]>1?[t=Math.max(0,Math.min(t,this[o]-this[j])),Math.max(t+this[j]-1,Math.min(i,this[o]-1))]:[-Infinity,Infinity]}function it(t){return this[k]===undefined?this[V]:(t=Number(t),Number.isNaN(t)?t=this[V]:t<this[K][this[k]].offset?t=this[K][this[k]].offset:t>=this[K][this[k]].offset+this[K][this[k]].data.length&&(t=this[K][this[k]].offset+this[K][this[k]].data.length-1),t)}function st(){this[b]||(this[b]=requestAnimationFrame(function(){var i=this,x=this[U]!==this[F]||this[Y]!==this[X];if(this[p].clearColor(this[u][0],this[u][1],this[u][2],1),this[p].clear(this[p].COLOR_BUFFER_BIT|this[p].DEPTH_BUFFER_BIT|this[p].STENCIL_BUFFER_BIT),this[g].clearRect(0,0,this[a],this[n]),this[o]>1){var N=function(t,i){var s=Math.max(this[U]-t.offset,0),h=[],e=[s];if(t.starts)for(var a=0;a<t.starts.length;a++)if(t.starts[a]<=s)h[0]=t.colors[a];else{if(!(t.starts[a]<this[Y]-t.offset))break;e.push(t.starts[a]),h.push(t.colors[a])}h.length<e.length&&h.unshift(this[f]);for(var n=0;n<e.length;n++)this[p].vertexAttrib1f(this[M],t.offset-this[U]),this[p].uniform4f(this[O],h[n][0],h[n][1],h[n][2],h[n][3]),this[p].drawArrays(this[p].LINE_STRIP,i+e[n],(n===e.length-1?Math.min(this[Y]-t.offset+1,t.data.length):e[n+1]+1)-e[n])},A=function(t){var i=t-this[U];nt.push({x:i}),rt.push({v:i*st,text:Number.isNaN(this[V])?this[s]?this[s](t):t:t-this[V]})},D=function(t,i){nt.push({y:t}),lt.push({v:t*_,text:Number.isNaN(this[V])?this[s]?this[s](i,!0):Math.round(100*i)/100:Math.round(1e3*(i>1||i<-1?Math.pow(i,3):i))/10+"%"})},j=function(t){for(var i=0;i<t.length;i++)t[i].hasOwnProperty("x")?(this[p].vertexAttrib1f(this[T],0),this[p].vertexAttrib1f(this[R],t[i].x)):(this[p].vertexAttrib1f(this[R],0),this[p].vertexAttrib1f(this[T],t[i].y)),this[p].drawArrays(this[p].LINE_STRIP,0,2)},q=function(t,i){if(this[g].font=this[B]+"px monospace",i){var s=_+1.5*this[B];this[g].textAlign="center",this[g].textBaseline="top",this[g].fillStyle=ht(this[v]);for(var h=0;h<t.length;h++)t[h].cur&&(this[g].fillStyle=ht(this[l]),this[g].fillRect(t[h].v+this[C]-this[w]/2,s-this[B]/2,this[w],2*this[B]),this[g].font="bold "+this[B]+"px monospace",this[g].fillStyle=ht(this[r])),this[g].fillText(t[h].text,t[h].v+this[C],s,this[C]-this[B])}else{var e=this[C]-this[B]/2;this[g].textAlign="right",this[g].textBaseline="middle",this[g].fillStyle=ht(this[v]);for(var a=0;a<t.length;a++)t[a].cur&&(this[g].fillStyle=ht(this[l]),this[g].fillRect(0,t[a].v,this[C],2*this[B]),this[g].font="bold "+this[B]+"px monospace",this[g].fillStyle=ht(this[r])),this[g].fillText(t[a].text,e,t[a].v+this[B],this[w]-this[B])}};if(x){var G=function(t){var s,h,e=i[K][t],a=Math.max(i[U]-e.offset,0),n=Math.min(i[Y]-e.offset,e.data.length-1),o=Math.max(i[F]-e.offset,0),r=Math.min(i[X]-e.offset,e.data.length-1);a===o&&n===r||(n>0&&a<e.data.length-1?(e.tmaxi>=a&&e.tmaxi<=n?(e.max=e.tmax,e.maxi=e.tmaxi):s=!0,e.tmini>=a&&e.tmini<=n?(e.min=e.tmin,e.mini=e.tmini):h=!0,(s||h)&&(a>o&&n<r?(s&&(e.maxi<a||e.maxi>n)&&(e.max=-Infinity),h&&(e.mini<a||e.mini>n)&&(e.min=Infinity)):a>o&&a<r?(s&&e.maxi<a&&(e.max=-Infinity),h&&e.mini<a&&(e.min=Infinity),l.call(i,r+1,n,s&&e.max!==-Infinity,h&&e.min!==Infinity)):n>o&&n<r?(s&&e.maxi>n&&(e.max=-Infinity),h&&e.mini>n&&(e.min=Infinity),l.call(i,a,o-1,s&&e.max!==-Infinity,h&&e.min!==Infinity)):a<=o&&n>=r?(l.call(i,a,o-1,s,h),l.call(i,r+1,n,s,h)):(s&&(e.max=-Infinity),h&&(e.min=Infinity)),l.call(i,a,n,e.max===-Infinity,e.min===Infinity))):(e.max=-Infinity,e.min=Infinity,e.maxi=e.mini=NaN));function l(t,i,s,h){if(s&&h)for(var a=t;a<=i;a++){var n=e.data[a];e.max<n&&(e.max=n,e.maxi=a),e.min>n&&(e.min=n,e.mini=a)}else if(s)for(var o=t;o<=i;o++){var r=e.data[o];e.max<r&&(e.max=r,e.maxi=o)}else if(h)for(var l=t;l<=i;l++){var f=e.data[l];e.min>f&&(e.min=f,e.mini=l)}}};for(var Z in this[K])G(Z);for(var Z in this[H]=-Infinity,this[W]=Infinity,this[K]){var $=this[K][Z];this[H]<$.max&&(this[H]=$.max),this[W]>$.min&&(this[W]=$.min)}}var z=J.call(this),_=Q.call(this),tt=this[Y]-this[U],it=this[H]-this[W],st=z/tt,et=this[H]/it,at=Math.ceil(this[w]/st),nt=[],ot=[],rt=[{v:0,text:Number.isNaN(this[V])?this[s]?this[s](this[U]):this[U]:this[U]-this[V]},{v:z,text:Number.isNaN(this[V])?this[s]?this[s](this[Y]):this[Y]:this[Y]-this[V]}],lt=[{v:0,text:Number.isNaN(this[V])?this[s]?this[s](this[H],!0):this[H]:Math.round(1e3*(this[H]>1||this[H]<-1?Math.pow(this[H],3):this[H]))/10+"%"},{v:_,text:Number.isNaN(this[V])?this[s]?this[s](this[W],!0):this[W]:Math.round(1e3*(this[W]>1||this[W]<-1?Math.pow(this[W],3):this[W]))/10+"%"}];if(this[V]>=this[U]&&this[V]<=this[Y]){for(var ft=Math.floor((this[Y]-this[V])/at),ut=(this[Y]-this[V])/ft,ct=1;ct<ft;ct++)A.call(this,this[V]+Math.round(ct*ut));ft=Math.floor((this[V]-this[U])/at),ut=(this[V]-this[U])/ft;for(var mt=1;mt<ft;mt++)A.call(this,this[V]-Math.round(mt*ut));if(this[V]!==this[U]&&this[V]!==this[Y]){var yt=this[V]-this[U];nt.push({x:yt}),rt.push({v:yt*st,text:0})}}else for(var dt=Math.floor((this[Y]-this[U])/at),vt=(this[Y]-this[U])/dt,bt=1;bt<dt;bt++)A.call(this,this[U]+Math.round(bt*vt));if(Number.isNaN(this[V])||this[H]<0||this[W]>0)for(var xt=Math.floor(_/this[L]),Nt=1;Nt<xt;Nt++)D.call(this,1-Nt/xt,this[W]+(this[H]-this[W])*Nt/xt);else{for(var pt=Math.floor(et*_/this[L]),gt=1;gt<pt;gt++)D.call(this,et-et*gt/pt,this[H]*gt/pt);pt=Math.floor((1-et)*_/this[L]);for(var St=1;St<pt;St++)D.call(this,et+(1-et)*St/pt,this[W]*St/pt);0!==this[H]&&0!==this[W]&&(nt.push({y:et}),lt.push({v:et*_,text:"0%"}))}if(!Number.isNaN(this[h]))if(this[k]===undefined){if(this[h]>=this[U]&&this[h]<=this[Y]){var It=this[h]-this[U];ot.push({x:It}),rt.push({v:It*st,text:0,cur:!0})}ot.push({y:et}),lt.push({v:et*_,text:"0%",cur:!0})}else{var Ot=this[h]-this[K][this[k]].offset;if(this[h]>=this[U]&&this[h]<=this[Y]){var At=this[h]-this[U];ot.push({x:At}),rt.push({v:At*st,text:Number.isNaN(this[V])?this[s]?this[s](this[h]):this[h]:this[s]?this[s](Ot):this[h]-this[V],cur:!0})}if(this[K][this[k]].data[Ot]>=this[W]&&this[K][this[k]].data[Ot]<=this[H]){var Mt=(this[H]-this[K][this[k]].data[Ot])/it;ot.push({y:Mt}),lt.push({v:Mt*_,text:Number.isNaN(this[V])?this[s]?this[s](this[K][this[k]].data[Ot],!0):this[K][this[k]].data[Ot]:this[s]?this[s](Ot,!0):Math.round(1e3*(this[K][this[k]].data[Ot]>1||this[K][this[k]].data[Ot]<-1?Math.pow(this[K][this[k]].data[Ot],3):this[K][this[k]].data[Ot]))/10+"%",cur:!0})}}var Et,Pt=4;for(var Rt in this[p].vertexAttrib1f(this[P],tt),this[p].vertexAttrib1f(this[S],it),this[p].vertexAttrib1f(this[I],this[H]),this[p].uniform4f(this[O],this[m][0],this[m][1],this[m][2],this[m][3]),this[K]){var Tt=this[K][Rt];if(Rt===this[k])Et=Pt;else if(Tt.offset<this[Y]&&Tt.data.length-1>this[U]-Tt.offset)if(this[t])N.call(this,Tt,Pt);else{var wt=Math.max(this[U]-Tt.offset,0);this[p].vertexAttrib1f(this[M],Tt.offset-this[U]),this[p].drawArrays(this[p].LINE_STRIP,Pt+wt,Math.min(this[Y]-Tt.offset+1,Tt.data.length)-wt)}Pt+=Tt.data.length}if(this[p].uniform4f(this[O],this[y][0],this[y][1],this[y][2],this[y][3]),j.call(this,nt),this[p].uniform4f(this[O],this[r][0],this[r][1],this[r][2],this[r][3]),j.call(this,ot),this[k]!==undefined&&this[K][this[k]].offset<this[Y]&&this[K][this[k]].data.length-1>this[U]-this[K][this[k]].offset){var Lt=this[K][this[k]],Ct=Math.max(this[U]-Lt.offset,0),Bt=Et+Ct,Ft=Math.min(this[Y]-Lt.offset+1,Lt.data.length)-Ct;this[p].uniform4f(this[O],this[c][0],this[c][1],this[c][2],this[c][3]),this[p].vertexAttrib1f(this[M],Lt.offset-this[U]),this[p].vertexAttrib1f(this[R],z*devicePixelRatio),this[p].vertexAttrib1f(this[T],_*devicePixelRatio);for(var Xt=1;Xt<=4;Xt++)this[p].vertexAttrib1f(this[E],Xt),this[p].drawArrays(this[p].LINE_STRIP,Bt,Ft);this[p].vertexAttrib1f(this[E],0),N.call(this,Lt,Et)}q.call(this,rt,!0),q.call(this,lt)}this[p].vertexAttrib1f(this[R],0),this[p].vertexAttrib1f(this[T],0),this[p].uniform4f(this[O],this[d][0],this[d][1],this[d][2],this[d][3]),this[p].drawArrays(this[p].LINE_LOOP,0,4),this[b]=0,this[F]=this[U],this[X]=this[Y],this.onpaitend&&this.onpaitend({type:"paitend"});x&&this.onrangechange&&this.onrangechange({type:"rangechange"});this[h]===this[e]||Number.isNaN(this[h])&&Number.isNaN(this[e])||(this[e]=this[h],this.oncursorchange&&this.oncursorchange({type:"cursorchange"}))}.bind(this)),this.onpaitbegin&&this.onpaitbegin({type:"paitbegin"}))}function ht(t){return"rgba("+Math.round(255*t[0])+","+Math.round(255*t[1])+","+Math.round(255*t[2])+", "+t[3]+")"}});