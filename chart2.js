'use strict';
const Chart = function () {
	const length = Symbol('length'),
		selectedColor = Symbol('selectedColor'),
		backgroundColor = Symbol('backgroundColor'),
		lineColor = Symbol('lineColor'),
		cursorColor = Symbol('cursorColor'),
		gridColor = Symbol('gridColor'),
		rectColor = Symbol('rectColor'),
		textColor = Symbol('textColor'),
		cursorTextColor = Symbol('cursorTextColor'),
		paiting = Symbol('paiting'),
		canvas2d = Symbol('canvas2d'),
		canvas3d = Symbol('canvas3d'),
		gl = Symbol('gl'),
		ground = Symbol('ground'),
		HV = Symbol('HV'),
		MAX = Symbol('MAX'),
		COLOR = Symbol('COLOR'),
		POSITION = Symbol('POSITION'),
		OFFSET = Symbol('OFFSET'),
		WV = Symbol('WV'),
		X = Symbol('X'),
		Y = Symbol('Y'),
		paddingX = Symbol('paddingX'),
		paddingY = Symbol('paddingY'),
		paddingLeft = Symbol('paddingLeft'),
		fontSize = Symbol('fontSize'),
		oldbegin = Symbol('oldbegin'),
		oldend = Symbol('oldend'),
		stage = Symbol('stage'),
		begin = Symbol('begin'),
		end = Symbol('end'),
		cursor = Symbol('cursor'),
		selected = Symbol('selected'),
		max = Symbol('max'),
		min = Symbol('min'),
		lines = Symbol('lines'),
		minLen = Symbol('minLen'),
		mouseListener = Symbol('mouseListener');

	function Chart(ctn) {
		this.fixed = false;
		this[paddingY] = 40;
		this[paddingX] = 60;
		this[paddingLeft] = 50;
		this[fontSize] = 10;
		this[selectedColor] = [0, 0, 0];
		this[backgroundColor] = [1, 1, 1];
		this[lineColor] = [0.75, 0.75, 0.75];
		this[cursorColor] = [1, 0.75, 0.75];
		this[gridColor] = [0.75, 0.75, 1];
		this[rectColor] = [0, 0, 0];
		this[textColor] = [0, 0, 0];
		this[cursorTextColor] = [1, 0, 0];
		this[lines] = {};
		this[mouseListener] = mousedown.bind(this);
		this[stage] = ctn.appendChild(document.createElement('div'));
		this[stage].style.width = this[stage].style.height = '100%';
		this[stage].style.overflow = 'hidden';
		this[stage].style.position = 'relative';
		this[stage].addEventListener('contextmenu', function (evt) {
			evt.preventDefault();
		});
		this[canvas2d] = this[stage].appendChild(document.createElement('canvas'));
		this[canvas2d].style.display = 'block';
		this[canvas2d].style.width = this[canvas2d].style.height = '100%';
		this[canvas3d] = this[stage].appendChild(document.createElement('canvas'));
		this[canvas3d].style.position = 'absolute';
		this[canvas3d].style.left = this[paddingLeft] + 'px';
		this[canvas3d].style.top = this[fontSize] / 2 + 'px';
		this[canvas3d].style.outline = 'none';
		this[canvas3d].tabIndex = 0;
		this[canvas3d].addEventListener('keydown', keydown.bind(this));
		this[canvas3d].addEventListener('mousedown', this[mouseListener]);
		this[canvas3d].addEventListener('wheel', wheel.bind(this));
		this[ground] = this[canvas2d].getContext('2d');
		this[gl] = this[canvas3d].getContext('webgl', {
			alpha: false,
			premultipliedAlpha: false,
			antialias: true,
			powerPreference: 'high-performance',
			depth: false,
			preserveDrawingBuffer: true
		});
		let vert = this[gl].createShader(this[gl].VERTEX_SHADER),
			frag = this[gl].createShader(this[gl].FRAGMENT_SHADER),
			program = this[gl].createProgram();
		this[gl].shaderSource(vert, `attribute vec2 POSITION;
		attribute float WV;
		attribute float HV;
		attribute float MAX;
		attribute float OFFSET;
		attribute float X;
		attribute float Y;
		void main(void) {
			if (POSITION.y < 0.0 || POSITION.y >= 0.0) {
				gl_Position = vec4((POSITION.x + OFFSET) * 2.0 / WV - 1.0, (POSITION.y - MAX) * 2.0 / HV + 1.0, 0.0, 1.0);
			} else if (X != 0.0) {
				gl_Position = vec4(X * 2.0 / WV - 1.0, POSITION.x, 0.0, 1.0);
			} else if (Y != 0.0) {
				gl_Position = vec4(POSITION.x, Y * -2.0 + 1.0, 0.0, 1.0);
			} else if (POSITION.x == 1.0) {
				gl_Position = vec4(1.0, -1.0, 0.0, 1.0);
			} else if (POSITION.x == 2.0) {
				gl_Position = vec4(1.0, 1.0, 0.0, 1.0);
			} else if (POSITION.x == 3.0) {
				gl_Position = vec4(-1.0, 1.0, 0.0, 1.0);
			} else {
				gl_Position = vec4(-1.0, -1.0, 0.0, 1.0);
			}
		}`);
		this[gl].shaderSource(frag, `uniform lowp vec4 COLOR;
		void main(void) {
			gl_FragColor = COLOR;
		}`);
		this[gl].compileShader(vert);
		this[gl].compileShader(frag);
		this[gl].attachShader(program, vert);
		this[gl].attachShader(program, frag);
		this[gl].linkProgram(program);
		this[gl].useProgram(program);
		this[POSITION] = this[gl].getAttribLocation(program, 'POSITION');
		this[WV] = this[gl].getAttribLocation(program, 'WV');
		this[HV] = this[gl].getAttribLocation(program, 'HV');
		this[MAX] = this[gl].getAttribLocation(program, 'MAX');
		this[OFFSET] = this[gl].getAttribLocation(program, 'OFFSET');
		this[X] = this[gl].getAttribLocation(program, 'X');
		this[Y] = this[gl].getAttribLocation(program, 'Y');
		this[COLOR] = this[gl].getUniformLocation(program, 'COLOR');
		this[gl].bindBuffer(this[gl].ARRAY_BUFFER, this[gl].createBuffer());
		this[gl].vertexAttribPointer(this[POSITION], 2, this[gl].FLOAT, false, 0, 0);
		this[gl].enableVertexAttribArray(this[POSITION]);
		if (self.ResizeObserver) {
			new ResizeObserver(syncSize.bind(this)).observe(this[stage]);
		} else {
			let frame = this[stage].insertBefore(document.createElement('iframe'), this[canvas2d]);
			frame.style.border = 'none';
			frame.style.display = 'block';
			frame.style.position = 'absolute';
			frame.style.top = frame.style.left = 0;
			frame.style.width = frame.style.height = '100%';
			frame.style.visibility = 'hidden';
			frame.contentWindow.addEventListener('resize', syncSize.bind(this));
		}
		syncSize.call(this);
	}

	Chart.prototype.add = function (data) {
		for (let c in data) {
			if (data[c].data.length > 1 && data[c].cursor >= 0 && data[c].cursor < data[c].data.length) {
				this[lines][c] = {
					data: [],
					cursor: data[c].cursor,
					tmax: -Infinity,
					tmin: Infinity
				};
				for (let i = 0; i < data[c].data.length; i++) {
					this[lines][c].data[i] = (data[c].data[i] - data[c].data[data[c].cursor]) / (i < data[c].cursor ? data[c].data[i] :  data[c].data[data[c].cursor]);
					if (this[lines][c].tmax < this[lines][c].data[i]) {
						this[lines][c].tmax = this[lines][c].data[i];
						this[lines][c].tmaxi = i;
					}
					if (this[lines][c].tmin > this[lines][c].data[i]) {
						this[lines][c].tmin = this[lines][c].data[i];
						this[lines][c].tmini = i;
					}
				}
			}
		}
		buildIndex.call(this);
	};

	Chart.prototype.remove = function (names) {
		let refresh;
		for (let i = 0; i < names.length; i++) {
			if (this[lines].hasOwnProperty(names[i])) {
				refresh = true;
				delete this[lines][names[i]];
			}
		}
		if (refresh) {
			if (this[selected] && !this[lines].hasOwnProperty(this[selected])) {
				this[selected] = undefined;
			}
			buildIndex.call(this);
			return true;
		}
	};

	Chart.prototype.setCursors = function(cursors) {
		let refresh;
		for (let c in cursors) {
			if (this[lines].hasOwnProperty(c) && cursors[c] !== this[lines][c].cursor && cursors[c] >= 0 && cursors[c] < this[lines][c].data.length) {
				this[lines][c].cursor = cursors[c];
				refresh = true;
			}
		}
		if (refresh) {
			buildIndex.call(this);
			return true;
		}
	};

	Chart.prototype.setSections = function (sections) {
		let refresh;
		for (let c in sections) {
			if (this[lines].hasOwnProperty(c)) {
				this[lines][c].sectionStarts = sections[c].starts;
				this[lines][c].colors = sections[c].colors;
				if (this[selected] === c) {
					refresh = true;
				}
			}
		}
		if (refresh) {
			draw.call(this);
			return true;
		}
	};

	Chart.prototype.center = function () {
		let len = Math.ceil((this[end] - this[begin]) / 2);
		return this.setRange(this[cursor] - len, this[cursor] + len);
	};

	Chart.prototype.setRange = function (bg, ed) {
		let range = checkRange.call(this, bg, ed);
		if (range[0] !== this[begin] || range[1] !== this[end]) {
			this[begin] = range[0];
			this[end] = range[1];
			draw.call(this);
			return true;
		}
	};

	Chart.prototype.moveCursorBy = function (x) {
		return changeCursor.call(this, this[cursor] + x);
	};

	Chart.prototype.moveCoordBy = function (i) {
		if (this[begin] + i < 0) {
			i = -this[begin];
		} else if (this[end] + i > this[length] - 1) {
			i = this[length] - 1 - this[end];
		}
		if (i) {
			this[begin] += i;
			this[end] += i;
			draw.call(this);
			return true;
		}
	};

	Chart.prototype.zoomCoordBy = function (x, percent) {
		let newlen,
			len = this[end] - this[begin];
		if (percent) {
			x = len * x / 100;
		}
		newlen = len + Math[x > 0 ? 'ceil' : 'floor'](x / 2) * 2;
		if (newlen < this[minLen]) {
			newlen = this[minLen];
		} else if (newlen > this[length] - 1) {
			newlen = this[length] - 1;
		}
		if (newlen !== len) {
			let l = (newlen - len) / 2;
			this[begin] -= Math.ceil(l);
			this[end] += Math.floor(l);
			if (this[begin] < 0) {
				this[end] -= this[begin];
				this[begin] = 0;
			} else if (this[end] > this[length] - 1) {
				this[begin] += this[length] - 1 - this[end];
				this[end] = this[length] - 1;
			}
			draw.call(this);
			return true;
		}
	};

	Chart.prototype.copy = function () {
		let canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');
		canvas.width = this[canvas2d].width;
		canvas.height = this[canvas2d].height;
		ctx.drawImage(this[canvas2d], 0, 0, this[canvas2d].width, this[canvas2d].height);
		this[gl].finish();
		ctx.drawImage(this[canvas3d], 0, 0, this[canvas3d].width, this[canvas3d].height, this[paddingLeft] * devicePixelRatio, this[fontSize] * devicePixelRatio / 2, this[canvas3d].width, this[canvas3d].height);
		return canvas;
	};

	Object.defineProperty(Chart.prototype, 'length', {
		get: function () {
			return this[length];
		}
	});

	Object.defineProperty(Chart.prototype, 'cursor', {
		get: function () {
			return this[cursor];
		}
	});

	Object.defineProperty(Chart.prototype, 'begin', {
		get: function () {
			return this[begin];
		},
		set: function (newbegin) {
			this.setRange(newbegin, this[end]);
		}
	});

	Object.defineProperty(Chart.prototype, 'end', {
		get: function () {
			return this[end];
		},
		set: function (newend) {
			this.setRange(this[begin], newend);
		}
	});

	Object.defineProperty(Chart.prototype, 'selected', {
		get: function () {
			return this[selected];
		},
		set: function (c) {
			c = String(c);
			if (!this[lines].hasOwnProperty(c)) {
				this[selected] = undefined;
			} else if (this[selected] !== c) {
				this[selected] = c;
			} else {
				return;
			}
			draw.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'paddingY', {
		get: function () {
			return this[paddingY];
		},
		set: function (y) {
			this[paddingY] = y;
			draw.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'paddingX', {
		get: function () {
			return this[paddingX];
		},
		set: function (x) {
			this[paddingX] = x;
			syncSize.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'paddingLeft', {
		get: function () {
			return this[paddingLeft];
		},
		set: function (x) {
			this[paddingLeft] = x;
			this[canvas3d].style.left = x + 'px';
			syncSize.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'fontSize', {
		get: function () {
			return this[fontSize];
		},
		set: function (x) {
			this[fontSize] = x;
			this[canvas3d].style.top = x / 2 + 'px';
			syncSize.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'selectedColor', {
		get: function () {
			return this[selectedColor];
		},
		set: function (c) {
			this[selectedColor] = c;
			draw.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'backgroundColor', {
		get: function () {
			return this[backgroundColor];
		},
		set: function (c) {
			this[backgroundColor] = c;
			draw.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'lineColor', {
		get: function () {
			return this[lineColor];
		},
		set: function (c) {
			this[lineColor] = c;
			draw.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'cursorColor', {
		get: function () {
			return this[cursorColor];
		},
		set: function (c) {
			this[cursorColor] = c;
			draw.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'gridColor', {
		get: function () {
			return this[gridColor];
		},
		set: function (c) {
			this[gridColor] = c;
			draw.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'rectColor', {
		get: function () {
			return this[rectColor];
		},
		set: function (c) {
			this[rectColor] = c;
			draw.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'textColor', {
		get: function () {
			return this[textColor];
		},
		set: function (c) {
			this[textColor] = c;
			draw.call(this);
		}
	});

	Object.defineProperty(Chart.prototype, 'cursorTextColor', {
		get: function () {
			return this[cursorTextColor];
		},
		set: function (c) {
			this[cursorTextColor] = c;
			draw.call(this);
		}
	});

	return Chart;

	function syncSize() {
		let w = this[stage].clientWidth,
			h = this[stage].clientHeight,
			wg = w - this[paddingLeft] - this[paddingX] / 2,
			hg = h - this[fontSize] * 2;
		this[canvas2d].width = w * devicePixelRatio;
		this[canvas2d].height = h * devicePixelRatio;
		this[canvas3d].width = wg * devicePixelRatio;
		this[canvas3d].height = hg * devicePixelRatio;
		this[canvas3d].style.width = wg + 'px';
		this[canvas3d].style.height = hg + 'px';
		this[ground].scale(devicePixelRatio, devicePixelRatio);
		this[gl].viewport(0, 0, this[canvas3d].width, this[canvas3d].height);
		calcLen.call(this);
		if (!this.setRange(this[begin], this[end])) {
			draw.call(this);
		}
	}

	function calcLen() {
		this[minLen] = Math.min(Math.floor(this[canvas3d].clientWidth / this[paddingX]), this[length] - 1);
	}

	function buildIndex() {
		let i = this[length] = this[cursor] = 0;
		for (let c in this[lines]) {
			if (this[cursor] < this[lines][c].cursor) {
				this[cursor] = this[lines][c].cursor;
			}
			i += this[lines][c].data.length;
		}
		for (let c in this[lines]) {
			this[lines][c].offset = this[cursor] - this[lines][c].cursor;
			let l = this[lines][c].offset + this[lines][c].data.length;
			if (this[length] < l) {
				this[length] = l;
			}
		}
		//first 8 numbers are for other use
		let data = new Float32Array(i * 2 + 8);
		data.set([-1, NaN, 1, NaN, 2, NaN, 3, NaN]);
		i = 8;
		for (let c in this[lines]) {
			let line = this[lines][c];
			for (let j = 0; j < line.data.length; j++) {
				data[i++] = j;
				data[i++] = line.data[j];
			}
		}
		this[gl].bufferData(this[gl].ARRAY_BUFFER, data, this[gl].STATIC_DRAW);
		calcLen.call(this);
		let range = checkRange.call(this, this[begin], this[end]);
		this[begin] = range[0];
		this[end] = range[1];
		this[oldbegin] = this[oldend] = undefined;
		draw.call(this);
	}

	function checkRange(bg, ed) {
		if (this[length] > 1) {
			bg = Math.max(0, Math.min(bg, this[length] - this[minLen]));
			return [bg, Math.max(bg + this[minLen] - 1, Math.min(ed, this[length] - 1))];
		} else {
			return [-Infinity, Infinity];
		}
	}

	function draw() {
		if (!this[paiting]) {
			this[paiting] = requestAnimationFrame(realDraw.bind(this));
			if (this.onpaitbegin) {
				this.onpaitbegin({
					type: 'paitbegin'
				});
			}
		}
	}

	function realDraw() {
		let fireRangeChange = this[begin] !== this[oldbegin] || this[end] !== this[oldend];
		this[ground].clearRect(0, 0, this[canvas2d].clientWidth, this[canvas2d].clientHeight);
		this[ground].font = this[fontSize] + 'px monospace';
		this[gl].clearColor(this[backgroundColor][0], this[backgroundColor][1], this[backgroundColor][2], 1);
		this[gl].clear(this[gl].COLOR_BUFFER_BIT | this[gl].DEPTH_BUFFER_BIT | this[gl].STENCIL_BUFFER_BIT);
		if (this[length] > 1) {
			if (fireRangeChange) {
				for (let c in this[lines]) {
					let line = this[lines][c],
						bg = Math.max(this[begin] - line.offset, 0),
						ed = Math.min(this[end] - line.offset, line.data.length - 1),
						obg = Math.max(this[oldbegin] - line.offset, 0),
						oed = Math.min(this[oldend] - line.offset, line.data.length - 1);
					if (bg !== obg || ed !== oed) {
						if (ed > 0 && bg < line.data.length - 1) {
							let findmax, findmin;
							if (line.tmaxi >= bg && line.tmaxi <= ed) {
								line.max = line.tmax;
								line.maxi = line.tmaxi;
							} else {
								findmax = true;
							}
							if (line.tmini >= bg && line.tmini <= ed) {
								line.min = line.tmin;
								line.mini = line.tmini;
							} else {
								findmin = true;
							}
							if (findmax || findmin) {
								if (bg > obg && ed < oed) {
									if (findmax && (line.maxi < bg || line.maxi > ed)) {
										line.max = -Infinity;
									}
									if (findmin && (line.mini < bg || line.mini > ed)) {
										line.min = Infinity;
									}
								} else if (bg > obg && bg < oed) {
									if (findmax && line.maxi < bg) {
										line.max = -Infinity;
									}
									if (findmin && line.mini < bg) {
										line.min = Infinity;
									}
									findMaxMin.call(this, oed + 1, ed, findmax && line.max !== -Infinity, findmin && line.min !== Infinity);
								} else if (ed > obg && ed < oed) {
									if (findmax && line.maxi > ed) {
										line.max = -Infinity;
									}
									if (findmin && line.mini > ed) {
										line.min = Infinity;
									}
									findMaxMin.call(this, bg, obg - 1, findmax && line.max !== -Infinity, findmin && line.min !== Infinity);
								} else if (bg <= obg && ed >= oed) {
									findMaxMin.call(this, bg, obg - 1, findmax, findmin);
									findMaxMin.call(this, oed + 1, ed, findmax, findmin);
								} else {
									if (findmax) {
										line.max = -Infinity;
									}
									if (findmin) {
										line.min = Infinity;
									}
								}
								findMaxMin.call(this, bg, ed, line.max === -Infinity, line.min === Infinity);
							}
						} else {
							line.max = -Infinity;
							line.min = Infinity;
							line.maxi = line.mini = NaN;
						}
					}

					function findMaxMin(bg, ed, findmax, findmin) {
						if (findmax && findmin) {
							for (let i = bg; i <= ed; i++) {
								let v = line.data[i];
								if (line.max < v) {
									line.max = v;
									line.maxi = i;
								}
								if (line.min > v) {
									line.min = v;
									line.mini = i;
								}
							}
						} else if (findmax) {
							for (let i = bg; i <= ed; i++) {
								let v = line.data[i];
								if (line.max < v) {
									line.max = v;
									line.maxi = i;
								}
							}
						} else if (findmin) {
							for (let i = bg; i <= ed; i++) {
								let v = line.data[i];
								if (line.min > v) {
									line.min = v;
									line.mini = i;
								}
							}
						}
					}
				}
				this[max] = -Infinity;
				this[min] = Infinity;
				for (let c in this[lines]) {
					let line = this[lines][c];
					if (this[max] < line.max) {
						this[max] = line.max;
					}
					if (this[min] > line.min) {
						this[min] = line.min;
					}
				}
			}
			let w = this[canvas3d].clientWidth,
				h = this[canvas3d].clientHeight,
				wv = this[end] - this[begin],
				hv = this[max] - this[min],
				wu = w / wv,
				hu = this[max] / hv,
				xys = [],
				curs = [],
				xtxts = [],
				ytxts = [];
			xtxts.push({
				v: this[paddingLeft],
				text: this[begin] - this[cursor]
			});
			xtxts.push({
				v: w + this[paddingLeft],
				text: this[end] - this[cursor]
			});
			if (this[cursor] >= this[begin] && this[cursor] <= this[end]) {
				let n1 = Math.floor((this[end] - this[cursor]) * wu / this[paddingX]),
					n2 = (this[end] - this[cursor]) / n1;
				for (let i = 1; i < n1; i++) {
					pushx.call(this, this[cursor] + Math.round(i * n2));
				}
				n1 = Math.floor((this[cursor] - this[begin]) * wu / this[paddingX]);
				n2 = (this[cursor] - this[begin]) / n1;
				for (let i = 1; i < n1; i++) {
					pushx.call(this, this[cursor] - Math.round(i * n2));
				}
				let x = this[cursor] - this[begin];
				curs.push({
					x: x
				});
				xtxts.push({
					v: x * wu + this[paddingLeft],
					text: 0
				});
			} else {
				let n1 = Math.floor(w / this[paddingX]),
					n2 = (this[end] - this[begin]) / n1;
				for (let i = 1; i < n1; i++) {
					pushx.call(this, this[cursor] < this[begin] ? this[begin] + Math.round(i * n2) : this[end] - Math.round(i * n2));
				}
			}
			ytxts.push({
				v: this[fontSize] / 2,
				text: Math.round(this[max] * 1000) / 10 + '%'
			});
			ytxts.push({
				v: h + this[fontSize] / 2,
				text: Math.round(this[min] * 1000) / 10 + '%'
			});
			if (this[max] >= 0 && this[min] <= 0) {
				let m = Math.floor(hu * h / this[paddingY]);
				for (let i = 1; i < m; i++) {
					pushy.call(this, hu - hu * i / m, this[max] * i / m);
				}
				m = Math.floor((1 - hu) * h / this[paddingY]);
				for (let i = 1; i < m; i++) {
					pushy.call(this, hu + (1 - hu) * i / m, this[min] * i / m);
				}
				if (this[max] === 0) {
					ytxts.push(ytxts.shift());
				} else if (this[min] === 0) {
					ytxts.push(ytxts.splice(1, 1)[0]);
				} else {
					curs.push({
						y: hu
					});
					ytxts.push({
						v: hu * h + this[fontSize] / 2,
						text: '0%'
					});
				}
			} else {
				let m = Math.floor(h / this[paddingY]);
				for (let i = 1; i < m; i++) {
					pushy.call(this, 1 - i / m, this[max] * i / m);
				}
			}
			let selPos,
				pos = 4;
			this[gl].vertexAttrib1f(this[WV], wv);
			this[gl].vertexAttrib1f(this[HV], hv);
			this[gl].vertexAttrib1f(this[MAX], this[max]);
			this[gl].uniform4f(this[COLOR], this[lineColor][0], this[lineColor][1], this[lineColor][2], 1);
			for (let c in this[lines]) {
				let line = this[lines][c];
				if (c === this[selected]) {
					selPos = pos;
				} else if (line.offset < this[end] && line.data.length - 1 > this[begin] - line.offset) {
					let bg = Math.max(this[begin] - line.offset, 0);
					this[gl].vertexAttrib1f(this[OFFSET], line.offset - this[begin]);
					this[gl].drawArrays(this[gl].LINE_STRIP, pos + bg, Math.min(this[end] - line.offset + 1, line.data.length) - bg);
				}
				pos += line.data.length;
			}
			this[gl].uniform4f(this[COLOR], this[gridColor][0], this[gridColor][1], this[gridColor][2], 1);
			drawxy.call(this, xys);
			this[gl].uniform4f(this[COLOR], this[cursorColor][0], this[cursorColor][1], this[cursorColor][2], 1);
			drawxy.call(this, curs);
			if (this[selected] && this[lines][this[selected]].offset < this[end] && this[lines][this[selected]].data.length - 1 > this[begin] - this[lines][this[selected]].offset) {
				let line = this[lines][this[selected]],
					bg = Math.max(this[begin] - line.offset, 0),
					colors = [],
					sectionStarts = [bg];
				if (line.sectionStarts) {
					for (let i = 0; i < line.sectionStarts.length; i++) {
						if (line.sectionStarts[i] <= bg) {
							colors[0] = line.colors[i];
						} else if (line.sectionStarts[i] < this[end] - line.offset) {
							sectionStarts.push(line.sectionStarts[i]);
							colors.push(line.colors[i]);
						} else {
							break;
						}
					}
				}
				if (colors.length < sectionStarts.length) {
					colors.unshift(this[selectedColor]);
				}
				for (let i = 0; i < sectionStarts.length; i++) {
					this[gl].vertexAttrib1f(this[OFFSET], line.offset - this[begin]);
					this[gl].uniform4f(this[COLOR], colors[i][0], colors[i][1], colors[i][2], 1);
					this[gl].drawArrays(this[gl].LINE_STRIP, selPos + sectionStarts[i], (i === sectionStarts.length - 1 ? Math.min(this[end] - line.offset + 1, line.data.length) : sectionStarts[i + 1] + 1) - sectionStarts[i]);
				}
			}
			drawText.call(this, xtxts, h + this[fontSize]);
			drawText.call(this, ytxts);

			function pushx(i) {
				let x = i - this[begin];
				xys.push({
					x: x
				});
				xtxts.push({
					v: x * wu + this[paddingLeft],
					text: i - this[cursor]
				});
			}

			function pushy(y, v) {
				xys.push({
					y: y
				});
				ytxts.push({
					v: y * h + this[fontSize] / 2,
					text: Math.round(v * 1000) / 10 + '%'
				});
			}

			function drawxy(pos) {
				for (let i = 0; i < pos.length; i++) {
					if (pos[i].hasOwnProperty('x')) {
						this[gl].vertexAttrib1f(this[Y], 0);
						this[gl].vertexAttrib1f(this[X], pos[i].x);
					} else {
						this[gl].vertexAttrib1f(this[X], 0);
						this[gl].vertexAttrib1f(this[Y], pos[i].y);
					}
					this[gl].drawArrays(this[gl].LINE_STRIP, 0, 2);
				}
			}

			function drawText(pos, y) {
				if (y === undefined) {
					let x = this[paddingLeft] - this[fontSize] / 2;
					this[ground].textAlign = 'right';
					this[ground].textBaseline = 'middle';
					this[ground].fillStyle = translateColor(this[textColor]);
					for (let i = 0; i < pos.length; i++) {
						if (i === pos.length - 1 && this[max] >= 0 && this[min] <= 0) {
							this[ground].fillStyle = translateColor(this[cursorTextColor]);
						}
						this[ground].fillText(pos[i].text, x, pos[i].v);
					}
				} else {
					this[ground].textAlign = 'center';
					this[ground].textBaseline = 'top';
					this[ground].fillStyle = translateColor(this[textColor]);
					for (let i = 0; i < pos.length; i++) {
						if (i === pos.length - 1 && this[cursor] >= this[begin] && this[cursor] <= this[end]) {
							this[ground].fillStyle = translateColor(this[cursorTextColor]);
						}
						this[ground].fillText(pos[i].text, pos[i].v, y);
					}
				}
			}
		}
		this[gl].vertexAttrib1f(this[X], 0);
		this[gl].vertexAttrib1f(this[Y], 0);
		this[gl].uniform4f(this[COLOR], this[rectColor][0], this[rectColor][1], this[rectColor][2], 1);
		this[gl].drawArrays(this[gl].LINE_LOOP, 0, 4);
		this[paiting] = 0;
		this[oldbegin] = this[begin];
		this[oldend] = this[end];
		if (this.onpaitend) {
			this.onpaitend({
				type: 'paitend'
			});
		}
		if (fireRangeChange && this.onrangechange) {
			this.onrangechange({
				type: 'rangechange'
			});
		}
	}

	function translateColor(c) {
		return 'rgb(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ')';
	}

	function mousedown(evt) {
		let fireX,
			mousemove = function (evt) {
			let x = (fireX - evt.offsetX) % (this[canvas3d].clientWidth / (this[end] - this[begin]));
			if (this.moveCoordBy(Math.round((fireX - evt.offsetX - x) * (this[end] - this[begin]) / this[canvas3d].clientWidth))) {
				fireX = evt.offsetX - x;
			}
		}.bind(this),
			mouseup = function (evt) {
				if (evt.button === 0) {
					this[canvas3d].style.cursor = '';
					this[canvas3d].removeEventListener('mousemove', mousemove);
					this[canvas3d].ownerDocument.removeEventListener('mouseup', mouseup);
					this[canvas3d].addEventListener('mousedown', this[mouseListener]);
				}
			}.bind(this);
		if (evt.button === 0) {
			fireX = evt.offsetX;
			this[canvas3d].style.cursor = 'move';
			this[canvas3d].removeEventListener('mousedown', this[mouseListener]);
			this[canvas3d].addEventListener('mousemove', mousemove);
			this[canvas3d].ownerDocument.addEventListener('mouseup', mouseup);
		}
	}

	function wheel(evt) {
		let absx = Math.abs(evt.deltaX),
			absy = Math.abs(evt.deltaY);
		evt.preventDefault();
		if (absx > absy) {
			if (evt.altKey && !this.fixed) {
				this.moveCursorBy(evt.deltaX);
			} else {
				this.moveCoordBy(Math.round(evt.deltaX));
			}
		} else if (absy > absx) {
			this.zoomCoordBy(evt.deltaY, evt.altKey);
		}
	}

	function keydown(evt) {
		if (evt.keyCode == 37) {
			this.moveCoordBy(1);
			evt.preventDefault();
		} else if (evt.keyCode == 39) {
			this.moveCoordBy(-1);
			evt.preventDefault();
		} else if (evt.keyCode == 38) {
			this.zoomCoordBy(-1, evt.altKey);
			evt.preventDefault();
		} else if (evt.keyCode == 40) {
			this.zoomCoordBy(1, evt.altKey);
			evt.preventDefault();
		}
	}
}();