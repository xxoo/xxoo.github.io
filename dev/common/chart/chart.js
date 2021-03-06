'use strict';
define(function () {
	const labeling = Symbol('labeling'),
		cursor = Symbol('cursor'),
		oldcursor = Symbol('oldcursor'),
		width = Symbol('width'),
		height = Symbol('height'),
		points = Symbol('points'),
		length = Symbol('length'),
		cursorColor = Symbol('cursorColor'),
		cursorTextColor = Symbol('cursorTextColor'),
		selectedColor = Symbol('selectedColor'),
		backgroundColor = Symbol('backgroundColor'),
		outlineColor = Symbol('outlineColor'),
		lineColor = Symbol('lineColor'),
		gridColor = Symbol('gridColor'),
		rectColor = Symbol('rectColor'),
		textColor = Symbol('textColor'),
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
		OUTLINE = Symbol('OUTLINE'),
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
		cross = Symbol('cross'),
		selected = Symbol('selected'),
		max = Symbol('max'),
		min = Symbol('min'),
		lines = Symbol('lines'),
		minLen = Symbol('minLen'),
		mouseListener = Symbol('mouseListener');

	function Chart(ctn, useCross, noResponse) {
		this[paddingY] = 40;
		this[paddingX] = 60;
		this[paddingLeft] = 50;
		this[fontSize] = 8;
		this[cursorColor] = [1, 0, 0, 1];
		this[cursorTextColor] = [1, 1, 1, 1];
		this[backgroundColor] = [1, 1, 1, 1];
		this[outlineColor] = [1, 1, 1, 1];
		this[selectedColor] = [0, 0, 0, 1];
		this[lineColor] = [[0.75, 0.75, 0.75, 1]];
		this[gridColor] = [0.75, 0.75, 1, 1];
		this[rectColor] = [0, 0, 0, 1];
		this[textColor] = [0, 0, 0, 1];
		if (!useCross) {
			this[cross] = NaN;
		}
		this[lines] = {};
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
		this[canvas3d].style.top = this[fontSize] + 'px';
		this[canvas3d].style.outline = 'none';
		this[canvas3d].tabIndex = 0;
		if (!noResponse) {
			this[canvas3d].style.cursor = 'grab';
			this[mouseListener] = mousedown.bind(this);
			this[canvas3d].addEventListener('keydown', keydown.bind(this));
			this[canvas3d].addEventListener('mousedown', this[mouseListener]);
			this[canvas3d].addEventListener('wheel', wheel.bind(this));
		}
		this[ground] = this[canvas2d].getContext('2d');
		this[gl] = this[canvas3d].getContext('webgl', {
			alpha: true,
			premultipliedAlpha: false,
			antialias: true,
			powerPreference: 'high-performance',
			depth: false,
			preserveDrawingBuffer: true
		});
		let vert = this[gl].createShader(this[gl].VERTEX_SHADER),
			frag = this[gl].createShader(this[gl].FRAGMENT_SHADER),
			program = this[gl].createProgram();
		this[gl].enable(this[gl].BLEND);
		this[gl].blendFunc(this[gl].SRC_ALPHA, this[gl].ONE_MINUS_SRC_ALPHA);
		this[gl].shaderSource(vert, `attribute vec4 POSITION;
		attribute vec4 COLOR;
		attribute float WV;
		attribute float HV;
		attribute float MAX;
		attribute float OFFSET;
		attribute float OUTLINE;
		attribute float X;
		attribute float Y;
		varying vec4 color;
		void main(void) {
			if (COLOR.x >= 0.0 && COLOR.y >= 0.0 && COLOR.z >= 0.0 && COLOR.w >= 0.0) {
				color = COLOR;
			} else {
				color.x = mod(POSITION.z, 256.0);
				color.y = (POSITION.z - color.x) / 256.0;
				color.z = mod(POSITION.w, 256.0);
				color.w = (POSITION.w - color.z) / 256.0;
				color /= 255.0;
				if (COLOR.w >= 0.0) {
					color.w = COLOR.w;
				}
			}
			if (POSITION.y < 0.0 || POSITION.y >= 0.0) {
				float x = (POSITION.x + OFFSET) / WV;
				float y = (POSITION.y - MAX) / HV;
				if (OUTLINE == 1.0) {
					y = (Y * y + 1.0) / Y;
				} else if (OUTLINE == 2.0) {
					y = (Y * y - 1.0) / Y;
				} else if (OUTLINE == 3.0) {
					x = (X * x + 1.0) / X;
				} else if (OUTLINE == 4.0) {
					x = (X * x - 1.0) / X;
				}
				gl_Position = vec4(x * 2.0 - 1.0, y * 2.0 + 1.0, 0.0, 1.0);
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
		this[gl].shaderSource(frag, `precision mediump float;
		varying vec4 color;
		void main(void) {
			gl_FragColor = color;
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
		this[OUTLINE] = this[gl].getAttribLocation(program, 'OUTLINE');
		this[X] = this[gl].getAttribLocation(program, 'X');
		this[Y] = this[gl].getAttribLocation(program, 'Y');
		this[COLOR] = this[gl].getAttribLocation(program, 'COLOR');
		this[gl].bindBuffer(this[gl].ARRAY_BUFFER, this[gl].createBuffer());
		this[gl].vertexAttribPointer(this[POSITION], 4, this[gl].FLOAT, false, 0, 0);
		this[gl].enableVertexAttribArray(this[POSITION]);
		if (self.ResizeObserver) {
			new ResizeObserver(sizeChange.bind(this)).observe(this[stage]);
		} else {
			let frame = this[stage].insertBefore(document.createElement('iframe'), this[canvas2d]);
			frame.style.border = 'none';
			frame.style.display = 'block';
			frame.style.position = 'absolute';
			frame.style.top = frame.style.left = 0;
			frame.style.width = frame.style.height = '100%';
			frame.style.visibility = 'hidden';
			frame.contentWindow.addEventListener('resize', sizeChange.bind(this));
		}
		syncSize.call(this);
		initData.call(this);
	}

	Chart.prototype.setData = function (data) {
		if (Number.isNaN(this[cross])) {
			for (let c in data) {
				if (!data[c]) {
					delete this[lines][c];
				} else if (data[c].data.length > 1) {
					this[lines][c] = {
						data: data[c].data,
						offset: data[c].offset | 0,
						colors: data[c].colors || this[lineColor],
						visible: 'visible' in data[c] ? data[c].visible : true,
						tmax: -Infinity,
						tmin: Infinity
					};
					for (let i = 0; i < data[c].data.length; i++) {
						checkMaxMin.call(this, c, i);
					}
				}
			}
		} else {
			for (let c in data) {
				if (!data[c]) {
					delete this[lines][c];
				} else if (data[c].data.length > 1 && data[c].cross >= 0 && data[c].cross < data[c].data.length) {
					this[lines][c] = {
						data: [],
						cross: data[c].cross,
						colors: data[c].colors || this[lineColor],
						visible: 'visible' in data[c] ? data[c].visible : true,
						tmax: -Infinity,
						tmin: Infinity
					};
					for (let i = 0; i < data[c].data.length; i++) {
						this[lines][c].data[i] = (data[c].data[i] - data[c].data[data[c].cross]) / (i < data[c].cross ? data[c].data[i] : data[c].data[data[c].cross]);
						if (this[lines][c].data[i] > 1 || this[lines][c].data[i] < -1) {
							this[lines][c].data[i] = Math.cbrt(this[lines][c].data[i]);
						}
						checkMaxMin.call(this, c, i);
					}
				}
			}
		}
		initData.call(this);

		function checkMaxMin(c, i) {
			if (this[lines][c].tmax < this[lines][c].data[i]) {
				this[lines][c].tmax = this[lines][c].data[i];
				this[lines][c].tmaxi = i;
			}
			if (this[lines][c].tmin > this[lines][c].data[i]) {
				this[lines][c].tmin = this[lines][c].data[i];
				this[lines][c].tmini = i;
			}
		}
	};

	Chart.prototype.setVisibility = function(data) {
		for (let c in data) {
			if (this[lines][c]) {
				this[lines][c].visible = data[c];
			}
		}
		initData.call(this, 'buffing');
	};

	Chart.prototype.setColor = function(colors) {
		for (let c in colors) {
			if (this[lines][c]) {
				this[lines][c].colors = colors[c] ? colors[c] : this[lineColor];
			}
		}
		initData.call(this, 'buffing');
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
			if (this[selected] !== undefined && !this[lines].hasOwnProperty(this[selected])) {
				this[selected] = undefined;
			}
			initData.call(this);
			return true;
		}
	};

	Chart.prototype.clear = function () {
		if (this[length]) {
			this[lines] = {};
			this[selected] = undefined;
			initData.call(this);
			return true;
		}
	};

	Chart.prototype.center = function () {
		if (!Number.isNaN(this[cursor])) {
			let len = Math.ceil((this[end] - this[begin]) / 2),
				bg = this[cursor] - len,
				ed = this[cursor] + len;
			if (bg < 0) {
				bg = 0;
				ed = this[cursor] * 2;
			} else if (ed >= this[length]) {
				ed = this[length] - 1;
				bg = this[cursor] * 2 - ed;
			}
			return this.setRange(bg, ed);
		}
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
			if (this[cursor] >= this[begin] && this[cursor] <= this[end]) {
				let l = newlen - len,
					ll = this[end] - this[begin];
				this[begin] += Math.round(l * (this[begin] - this[cursor]) / ll);
				this[end] += Math.round(l * (this[end] - this[cursor]) / ll);
			} else {
				let l = (newlen - len) / 2;
				this[begin] -= Math.ceil(l);
				this[end] += Math.floor(l);
			}
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

	Object.defineProperties(Chart.prototype, {
		points: {
			get: function() {
				return this[points];
			}
		},
		length: {
			get: function () {
				return this[length];
			}
		},
		cross: {
			get: function () {
				return this[cross];
			}
		},
		labeling: {
			get: function() {
				return this[labeling];
			},
			set: function(func) {
				this[labeling] = func;
				if (this[cursor] >= this[begin] && this[cursor] <= this[end]) {
					draw.call(this);
				}
			}
		},
		cursor: {
			get: function() {
				return this[cursor];
			},
			set: function(cur) {
				cur = checkCursor.call(this, cur);
				if (this[cursor] !== cur) {
					this[cursor] = cur;
					draw.call(this);
				}
			}
		},
		begin: {
			get: function () {
				return this[begin];
			},
			set: function (newbegin) {
				this.setRange(newbegin, this[end]);
			}
		},
		end: {
			get: function () {
				return this[end];
			},
			set: function (newend) {
				this.setRange(this[begin], newend);
			}
		},
		selected: {
			get: function () {
				return this[selected];
			},
			set: function (c) {
				let idxchange;
				c = String(c);
				if (!this[lines].hasOwnProperty(c)) {
					this[selected] = undefined;
				} else if (this[selected] !== c) {
					idxchange = !this[lines][c].visible || (this[selected] && !this[lines][this[selected]].visible);
					this[selected] = c;
				} else {
					return;
				}
				if (idxchange) {
					initData.call(this, 'buffering');
				} else {
					this[cursor] = checkCursor.call(this, this[cursor]);
					draw.call(this);
				}
			}
		},
		paddingX: {
			get: function () {
				return this[paddingX];
			},
			set: function (x) {
				this[paddingX] = x;
				sizeChange.call(this);
			}
		},
		paddingY: {
			get: function () {
				return this[paddingY];
			},
			set: function (y) {
				this[paddingY] = y;
				draw.call(this);
			}
		},
		paddingLeft: {
			get: function () {
				return this[paddingLeft];
			},
			set: function (x) {
				this[paddingLeft] = x;
				this[canvas3d].style.left = x + 'px';
				sizeChange.call(this);
			}
		},
		fontSize: {
			get: function () {
				return this[fontSize];
			},
			set: function (x) {
				this[fontSize] = x;
				this[canvas3d].style.top = x + 'px';
				sizeChange.call(this);
			}
		},
		selectedColor: {
			get: function () {
				return this[selectedColor];
			},
			set: function (c) {
				this[selectedColor] = c;
				draw.call(this);
			}
		},
		backgroundColor: {
			get: function () {
				return this[backgroundColor];
			},
			set: function (c) {
				this[backgroundColor] = c;
				draw.call(this);
			}
		},
		lineColor: {
			get: function () {
				return this[lineColor][0];
			},
			set: function (c) {
				this[lineColor][0] = c;
				initData.call(this, 'indexing');
			}
		},
		cursorColor: {
			get: function () {
				return this[cursorColor];
			},
			set: function (c) {
				this[cursorColor] = c;
				if ((this[cursor] >= this[begin] && this[cursor] <= this[end]) || (this[lines][this[selected]].data[i] >= this[min] && this[lines][this[selected]].data[i] <= this[max])) {
					draw.call(this);
				}
			}
		},
		gridColor: {
			get: function () {
				return this[gridColor];
			},
			set: function (c) {
				this[gridColor] = c;
				draw.call(this);
			}
		},
		rectColor: {
			get: function () {
				return this[rectColor];
			},
			set: function (c) {
				this[rectColor] = c;
				draw.call(this);
			}
		},
		textColor: {
			get: function () {
				return this[textColor];
			},
			set: function (c) {
				this[textColor] = c;
				draw.call(this);
			}
		}
	});

	return Chart;

	function getWidth() {
		return this[width] - this[paddingLeft] - this[paddingX] / 2;
	}

	function getHeight() {
		return this[height] - this[fontSize] * 3;
	}

	function sizeChange() {
		syncSize.call(this);
		calcLen.call(this);
		if (!this.setRange(this[begin], this[end])) {
			draw.call(this);
		}
	}

	function syncSize() {
		this[width] = this[stage].clientWidth;
		this[height] = this[stage].clientHeight;
		let wg = getWidth.call(this),
			hg = getHeight.call(this);
		this[canvas2d].width = this[width] * devicePixelRatio;
		this[canvas2d].height = this[height] * devicePixelRatio;
		this[canvas3d].width = wg * devicePixelRatio;
		this[canvas3d].height = hg * devicePixelRatio;
		this[canvas3d].style.width = wg + 'px';
		this[canvas3d].style.height = hg + 'px';
		this[ground].scale(devicePixelRatio, devicePixelRatio);
		this[gl].viewport(0, 0, this[canvas3d].width, this[canvas3d].height);
	}

	function calcLen() {
		this[minLen] = Math.min(Math.floor(getWidth.call(this) / this[paddingX]), this[length] - 1);
	}

	function initData(skip) {
		if (skip !== 'indexing') {
			this[points] = this[length] = 0;
			if (Number.isNaN(this[cross])) {
				let first = Infinity;
				for (let c in this[lines]) {
					if ((this[lines][c].visible || this[selected] === c) && first > this[lines][c].offset) {
						first = this[lines][c].offset;
					}
					this[points] += this[lines][c].data.length;
				}
				for (let c in this[lines]) {
					this[lines][c].offset -= first;
					if (this[lines][c].visible || this[selected] === c) {
						let l = this[lines][c].offset + this[lines][c].data.length;
						if (this[length] < l) {
							this[length] = l;
						}
					}
				}
			} else {
				this[cross] = 0;
				for (let c in this[lines]) {
					if (this[lines][c].visible && this[cross] < this[lines][c].cross) {
						this[cross] = this[lines][c].cross;
					}
					this[points] += this[lines][c].data.length;
				}
				for (let c in this[lines]) {
					this[lines][c].offset = this[cross] - this[lines][c].cross;
					if (this[lines][c].visible) {
						let l = this[lines][c].offset + this[lines][c].data.length;
						if (this[length] < l) {
							this[length] = l;
						}
					}
				}
			}
			calcLen.call(this);
			this[cursor] = checkCursor.call(this, this[cursor]);
			let range = checkRange.call(this, this[begin], this[end]);
			this[begin] = range[0];
			this[end] = range[1];
			this[oldbegin] = this[oldend] = this[oldcursor] = undefined;
		}
		if (skip !== 'buffering') {
			//first 4 points are for other use
			let i = 16,
				data = new Float32Array(this[points] * 4 + i);
			data.set([-1, NaN, NaN, NaN, 1, NaN, NaN, NaN, 2, NaN, NaN, NaN, 3, NaN, NaN, NaN]);
			for (let c in this[lines]) {
				let line = this[lines][c],
					lastColor;
				for (let j = 0; j < line.data.length; j++) {
					if (line.colors[j]) {
						lastColor = translateColor(line.colors[j], true);
					}
					data[i++] = j;
					data[i++] = line.data[j];
					data[i++] = lastColor[0];
					data[i++] = lastColor[1];
				}
			}
			this[gl].bufferData(this[gl].ARRAY_BUFFER, data, this[gl].STATIC_DRAW);
		}
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

	function checkCursor(cur) {
		if (this[selected] === undefined) {
			return this[cross];
		} else {
			cur = Number(cur);
			if (Number.isNaN(cur)) {
				cur = this[cross];
			} else if (cur < this[lines][this[selected]].offset) {
				cur = this[lines][this[selected]].offset;
			} else if (cur >= this[lines][this[selected]].offset + this[lines][this[selected]].data.length) {
				cur = this[lines][this[selected]].offset + this[lines][this[selected]].data.length - 1;
			}
			return cur;
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
		this[gl].clearColor(this[backgroundColor][0], this[backgroundColor][1], this[backgroundColor][2], 1);
		this[gl].clear(this[gl].COLOR_BUFFER_BIT | this[gl].DEPTH_BUFFER_BIT | this[gl].STENCIL_BUFFER_BIT);
		this[ground].clearRect(0, 0, this[width], this[height]);
		if (this[length] > 1) {
			if (fireRangeChange) {
				for (let c in this[lines]) {
					let line = this[lines][c];
					if (line.visible || this[selected] === c) {
						let bg = Math.max(this[begin] - line.offset, 0),
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
				}
				this[max] = -Infinity;
				this[min] = Infinity;
				for (let c in this[lines]) {
					let line = this[lines][c];
					if (line.visible || this[selected === c]) {
						if (this[max] < line.max) {
							this[max] = line.max;
						}
						if (this[min] > line.min) {
							this[min] = line.min;
						}
					}
				}
			}
			let w = getWidth.call(this),
				h = getHeight.call(this),
				wv = this[end] - this[begin],
				hv = this[max] - this[min],
				wu = w / wv,
				hu = this[max] / hv,
				n = Math.ceil(this[paddingX] / wu),
				xys = [],
				curs = [],
				xtxts = [{
					v: 0,
					text: Number.isNaN(this[cross]) ? this[labeling] ? this[labeling](this[begin]) : this[begin] : this[begin] - this[cross]
				}, {
					v: w,
					text: Number.isNaN(this[cross]) ? this[labeling] ? this[labeling](this[end]) : this[end] : this[end] - this[cross]
				}],
				ytxts = [{
					v: 0,
					text: Number.isNaN(this[cross]) ? this[labeling] ? this[labeling](this[max], true) : this[max] : Math.round((this[max] > 1 || this[max] < -1 ? this[max] ** 3 : this[max]) * 1000) / 10 + '%'
				}, {
					v: h,
					text: Number.isNaN(this[cross]) ?  this[labeling] ? this[labeling](this[min], true) : this[min] : Math.round((this[min] > 1 || this[min] < -1 ? this[min] ** 3 : this[min]) * 1000) / 10 + '%'
				}];
			if (this[cross] >= this[begin] && this[cross] <= this[end]) {
				let n1 = Math.floor((this[end] - this[cross]) / n),
					n2 = (this[end] - this[cross]) / n1;
				for (let i = 1; i < n1; i++) {
					pushx.call(this, this[cross] + Math.round(i * n2));
				}
				n1 = Math.floor((this[cross] - this[begin]) / n);
				n2 = (this[cross] - this[begin]) / n1;
				for (let i = 1; i < n1; i++) {
					pushx.call(this, this[cross] - Math.round(i * n2));
				}
				if (this[cross] !== this[begin] && this[cross] !== this[end]) {
					let x = this[cross] - this[begin];
					xys.push({
						x: x
					});
					xtxts.push({
						v: x * wu,
						text: 0
					});
				}
			} else {
				let n1 = Math.floor((this[end] - this[begin]) / n),
					n2 = (this[end] - this[begin]) / n1;
				for (let i = 1; i < n1; i++) {
					pushx.call(this, this[begin] + Math.round(i * n2));
				}
			}
			if (Number.isNaN(this[cross]) || this[max] < 0 || this[min] > 0) {
				let m = Math.floor(h / this[paddingY]);
				for (let i = 1; i < m; i++) {
					pushy.call(this, 1 - i / m, this[min] + (this[max] - this[min]) * i / m);
				}
			} else {
				let m = Math.floor(hu * h / this[paddingY]);
				for (let i = 1; i < m; i++) {
					pushy.call(this, hu - hu * i / m, this[max] * i / m);
				}
				m = Math.floor((1 - hu) * h / this[paddingY]);
				for (let i = 1; i < m; i++) {
					pushy.call(this, hu + (1 - hu) * i / m, this[min] * i / m);
				}
				if (this[max] !== 0 && this[min] !== 0) {
					xys.push({
						y: hu
					});
					ytxts.push({
						v: hu * h,
						text: '0%'
					});
				}
			}
			if (!Number.isNaN(this[cursor])) {
				if (this[selected] === undefined) {
					if (this[cursor] >= this[begin] && this[cursor] <= this[end]) {
						let x = this[cursor] - this[begin];
						curs.push({
							x: x
						});
						xtxts.push({
							v: x * wu,
							text: 0,
							cur: true
						});
					}
					curs.push({
						y: hu
					});
					ytxts.push({
						v: hu * h,
						text: '0%',
						cur: true
					});
				} else {
					let i = this[cursor] - this[lines][this[selected]].offset;
					if (this[cursor] >= this[begin] && this[cursor] <= this[end]) {
						let x = this[cursor] - this[begin];
						curs.push({
							x: x
						});
						xtxts.push({
							v: x * wu,
							text: Number.isNaN(this[cross]) ? this[labeling] ? this[labeling](this[cursor]) : this[cursor] : this[labeling] ? this[labeling](i) : this[cursor] - this[cross],
							cur: true
						});
					}
					if (this[lines][this[selected]].data[i] >= this[min] && this[lines][this[selected]].data[i] <= this[max]) {
						let y = (this[max] - this[lines][this[selected]].data[i]) / hv;
						curs.push({
							y: y
						});
						ytxts.push({
							v: y * h,
							text: Number.isNaN(this[cross]) ? this[labeling] ? this[labeling](this[lines][this[selected]].data[i], true) : this[lines][this[selected]].data[i] : this[labeling] ? this[labeling](i, true) : Math.round((this[lines][this[selected]].data[i] > 1 || this[lines][this[selected]].data[i] < -1 ? this[lines][this[selected]].data[i] ** 3 : this[lines][this[selected]].data[i]) * 1000) / 10 + '%',
							cur: true
						});
					}
				}
			}
			let selPos,
				pos = 4;
			this[gl].vertexAttrib1f(this[WV], wv);
			this[gl].vertexAttrib1f(this[HV], hv);
			this[gl].vertexAttrib1f(this[MAX], this[max]);
			this[gl].vertexAttrib4f(this[COLOR], NaN, NaN, NaN, NaN);
			for (let c in this[lines]) {
				let line = this[lines][c];
				if (line.visible) {
					if (c === this[selected]) {
						selPos = pos;
					} else if (line.offset < this[end] && line.data.length - 1 > this[begin] - line.offset) {
						let bg = Math.max(this[begin] - line.offset, 0);
						this[gl].vertexAttrib1f(this[OFFSET], line.offset - this[begin]);
						this[gl].drawArrays(this[gl].LINE_STRIP, pos + bg, Math.min(this[end] - line.offset + 1, line.data.length) - bg);
					}
				}
				pos += line.data.length;
			}
			this[gl].vertexAttrib4f(this[COLOR], this[gridColor][0], this[gridColor][1], this[gridColor][2], this[gridColor][3]);
			drawxy.call(this, xys);
			this[gl].vertexAttrib4f(this[COLOR], this[cursorColor][0], this[cursorColor][1], this[cursorColor][2], this[cursorColor][3]);
			drawxy.call(this, curs);
			if (this[selected] !== undefined && this[lines][this[selected]].offset < this[end] && this[lines][this[selected]].data.length - 1 > this[begin] - this[lines][this[selected]].offset) {
				let line = this[lines][this[selected]],
					bg = Math.max(this[begin] - line.offset, 0),
					p = selPos + bg,
					l = Math.min(this[end] - line.offset + 1, line.data.length) - bg;
				this[gl].vertexAttrib4f(this[COLOR], this[outlineColor][0], this[outlineColor][1], this[outlineColor][2], this[outlineColor][3]);
				this[gl].vertexAttrib1f(this[OFFSET], line.offset - this[begin]);
				this[gl].vertexAttrib1f(this[X], w * devicePixelRatio);
				this[gl].vertexAttrib1f(this[Y], h * devicePixelRatio);
				for (let i = 1; i <= 4; i++) {
					this[gl].vertexAttrib1f(this[OUTLINE], i);
					this[gl].drawArrays(this[gl].LINE_STRIP, p, l);
				}
				this[gl].vertexAttrib1f(this[OUTLINE], 0);
				if (line.colors === this[lineColor]) {
					this[gl].vertexAttrib4f(this[COLOR], this[selectedColor][0], this[selectedColor][1], this[selectedColor][2], this[selectedColor][3]);
				} else {
					this[gl].vertexAttrib4f(this[COLOR], NaN, NaN, NaN, 1);
				}
				this[gl].drawArrays(this[gl].LINE_STRIP, p, l);
			}
			drawText.call(this, xtxts, true);
			drawText.call(this, ytxts);

			function pushx(i) {
				let x = i - this[begin];
				xys.push({
					x: x
				});
				xtxts.push({
					v: x * wu,
					text: Number.isNaN(this[cross]) ? this[labeling] ? this[labeling](i) : i : i - this[cross]
				});
			}

			function pushy(y, v) {
				xys.push({
					y: y
				});
				ytxts.push({
					v: y * h,
					text: Number.isNaN(this[cross]) ? this[labeling] ? this[labeling](v, true) : Math.round(v * 100) / 100 : Math.round((v > 1 || v < -1 ? v ** 3 : v) * 1000) / 10 + '%'
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

			function drawText(pos, isx) {
				this[ground].font = this[fontSize] + 'px monospace';
				if (isx) {
					let y = h + this[fontSize] * 1.5;
					this[ground].textAlign = 'center';
					this[ground].textBaseline = 'top';
					this[ground].fillStyle = translateColor(this[textColor]);
					for (let i = 0; i < pos.length; i++) {
						if (pos[i].cur) {
							this[ground].fillStyle = translateColor(this[cursorColor]);
							this[ground].fillRect(pos[i].v + this[paddingLeft] - this[paddingX] / 2, y - this[fontSize] / 2, this[paddingX], this[fontSize] * 2);
							this[ground].font = 'bold ' + this[fontSize] + 'px monospace';
							this[ground].fillStyle = translateColor(this[cursorTextColor]);
						}
						this[ground].fillText(pos[i].text, pos[i].v + this[paddingLeft], y, this[paddingLeft] - this[fontSize]);
					}
				} else {
					let x = this[paddingLeft] - this[fontSize] / 2;
					this[ground].textAlign = 'right';
					this[ground].textBaseline = 'middle';
					this[ground].fillStyle = translateColor(this[textColor]);
					for (let i = 0; i < pos.length; i++) {
						if (pos[i].cur) {
							this[ground].fillStyle = translateColor(this[cursorColor]);
							this[ground].fillRect(0, pos[i].v, this[paddingLeft], this[fontSize] * 2);
							this[ground].font = 'bold ' + this[fontSize] + 'px monospace';
							this[ground].fillStyle = translateColor(this[cursorTextColor]);
						}
						this[ground].fillText(pos[i].text, x, pos[i].v + this[fontSize], this[paddingX] - this[fontSize]);
					}
				}
			}
		}
		this[gl].vertexAttrib1f(this[X], 0);
		this[gl].vertexAttrib1f(this[Y], 0);
		this[gl].vertexAttrib4f(this[COLOR], this[rectColor][0], this[rectColor][1], this[rectColor][2], this[rectColor][3]);
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
		if (this[cursor] !== this[oldcursor] && (!Number.isNaN(this[cursor]) || !Number.isNaN(this[oldcursor]))) {
			this[oldcursor] = this[cursor];
			if (this.oncursorchange) {
				this.oncursorchange({
					type: 'cursorchange'
				});
			}
		}
	}

	function translateColor(c, toVec2) {
		return toVec2 ? [Math.round(c[0] * 255) + Math.round(c[1] * 255) * 256, Math.round(c[2] * 255) + Math.round(c[3] * 255) * 256] : 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ', ' + c[3] + ')';
	}

	function mousedown(evt) {
		let fireX, btn,
			mousemove = function (evt) {
				if (btn === 2) {
					moveCursor.call(this, evt.offsetX);
				} else {
					let w = getWidth.call(this),
						x = (fireX - evt.offsetX) % (w / (this[end] - this[begin]));
					if (this.moveCoordBy(Math.round((fireX - evt.offsetX - x) * (this[end] - this[begin]) / w))) {
						fireX = evt.offsetX - x;
					}
				}
			}.bind(this),
			mouseup = function (evt) {
				if (evt.button === btn) {
					this[canvas3d].style.cursor = 'grab';
					this[canvas3d].removeEventListener('mousemove', mousemove);
					this[canvas3d].ownerDocument.removeEventListener('mouseup', mouseup);
					this[canvas3d].addEventListener('mousedown', this[mouseListener]);
				}
			}.bind(this),
			start = function() {
				this[canvas3d].removeEventListener('mousedown', this[mouseListener]);
				this[canvas3d].addEventListener('mousemove', mousemove);
				this[canvas3d].ownerDocument.addEventListener('mouseup', mouseup);
			},
			moveCursor = function(x) {
				this.cursor = this[begin] + Math.round(x * (this[end] - this[begin]) / getWidth.call(this));
			};
		btn = evt.button;
		if (btn === 0) {
			fireX = evt.offsetX;
			this[canvas3d].style.cursor = 'grabbing';
			start.call(this);
		} else if (btn === 2 && this[selected] !== undefined) {
			this[canvas3d].style.cursor = 'crosshair';
			start.call(this);
			moveCursor.call(this, evt.offsetX);
		}
	}

	function wheel(evt) {
		let absx = Math.abs(evt.deltaX),
			absy = Math.abs(evt.deltaY);
		evt.preventDefault();
		if (absx > absy) {
			this.moveCoordBy(Math.round(evt.deltaX));
		} else if (absy > absx) {
			this.zoomCoordBy(evt.deltaY, evt.altKey);
		}
	}

	function keydown(evt) {
		if (evt.keyCode == 37) {
			if (evt.altKey) {
				this.cursor -= 1;
			} else {
				this.moveCoordBy(1);
			}
			evt.preventDefault();
		} else if (evt.keyCode == 39) {
			if (evt.altKey) {
				this.cursor += 1;
			} else {
				this.moveCoordBy(-1);
			}
			evt.preventDefault();
		} else if (evt.keyCode == 38) {
			this.zoomCoordBy(-1, evt.altKey);
			evt.preventDefault();
		} else if (evt.keyCode == 40) {
			this.zoomCoordBy(1, evt.altKey);
			evt.preventDefault();
		}
	}
});