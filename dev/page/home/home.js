'use strict';
define(['module', 'common/kernel/kernel', 'common/chart/chart'], function (module, kernel, Chart) {
	let thisPage = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#page>.' + thisPage),
		chart = new Chart(dom.querySelector('.chart'), true),
		subchart = new Chart(dom.querySelector('.subchart'), false, true),
		url = 'https://trade.tinysoft.com.cn/webapi/api2.tsl',
		cs = [{}, {}, {}],
		allLines = {},
		name = dom.querySelector('.list>.name'),
		ctx = dom.querySelector('.list>.canvas>canvas').getContext('2d'),
		arr = dom.querySelector('.list>span'),
		names, days;
	//chart.paddingLeft = subchart.paddingLeft = 60;
	//chart.paddingX = subchart.paddingX = 70;
	subchart.labeling = function (v, isy) {
		return isy ? Math.round(v * 1000) / 10 + '%' : new Date(tslDateToVal(days[v])).toISOString().replace(/T.*$/, '');
	};
	chart.labeling = function (i, isy) {
		return isy ? Math.round(allLines[chart.selected].data[i] / allLines[chart.selected].rate * 100) / 100 : new Date(tslDateToVal(days[i + allLines[chart.selected].offset])).toISOString().replace(/T.*$/, '');
	};
	chart.onrangechange = function() {
		if (chart.selected) {
			let offset = chart.cross - allLines[chart.selected].cross - allLines[chart.selected].offset;
			subchart.setRange(chart.begin - offset, chart.end - offset);
		}
	};
	ctx.canvas.width = 1;
	ctx.canvas.addEventListener('mousedown', mousedown);
	ctx.canvas.addEventListener('keydown', function(evt) {
		if (chart.selected && (evt.keyCode === 38 || evt.keyCode === 40)) {
			evt.preventDefault();
			let i = names.indexOf(chart.selected);
			if (evt.keyCode === 38) {
				if (i > 0) {
					selectStock(this.offsetHeight * (i - 1) / (names.length - 1));
				}
			} else {
				if (i < names.length - 1) {
					selectStock(this.offsetHeight * (i + 1) / (names.length - 1));
				}
			}
		}
	});
	return {
		onload: function (force) {
			if (force) {
				kernel.showLoading();
				Promise.all([fetch(url, {
					method: 'post',
					body: 'ServiceID=Z002'
				}).then(function (response) {
					return response.json();
				}), fetch(url, {
					method: 'post',
					body: 'ServiceID=Z003&param=[' + encodeURIComponent('"A股"') + ']'
				}).then(function (response) {
					return response.json();
				}).then(function (json) {
					let stocks = json.Result;
					return caches.open('chart').then(function (cache) {
						return cache.match('/data').then(function (response) {
							if (response) {
								return response.json().then(function (data) {
									return fetch(url, {
										method: 'post',
										body: 'ServiceID=Z001&param=["' + Object.keys(stocks).join(';') + '",' + data.days[data.days.length - 1] + ']'
									}).then(function (response) {
										return response.json();
									}).then(function (json) {
										for (let i = 1; i < json.Result.length; i++) {
											if (i > 1) {
												data.days.push(json.Result[i][0]);
											}
											for (let j = 1; j < json.Result[i].length; j++) {
												if (json.Result[i][j] !== null) {
													if (!data.base[json.Result[0][j]]) {
														data.base[json.Result[0][j]] = [stocks[json.Result[0][j]], data.days.length - 1];
													}
													if (i === 1 && data.base[json.Result[0][j]].length > 2) {
														data.base[json.Result[0][j]].splice(-1, 1, json.Result[i][j]);
													} else {
														data.base[json.Result[0][j]].push(json.Result[i][j]);
													}
												}
											}
										}
										if (json.Result.length > 2) {
											cache.put('/data', new Response(JSON.stringify(data)));
										}
										//json.Result = null;
										return data;
									});
								});
							} else {
								return fetch(url, {
									method: 'post',
									body: 'ServiceID=Z001&param=["' + Object.keys(stocks).join(';') + '"]'
								}).then(function (response) {
									return response.json();
								}).then(function (json) {
									let data = {
										days: [],
										base: {}
									};
									for (let i = 1; i < json.Result.length; i++) {
										for (let j = 1; j < json.Result[i].length; j++) {
											if (json.Result[i][j] !== null) {
												if (!data.base[json.Result[0][j]]) {
													data.base[json.Result[0][j]] = [stocks[json.Result[0][j]], data.days.length];
												}
												data.base[json.Result[0][j]].push(json.Result[i][j]);
											}
										}
										data.days.push(json.Result[i][0]);
									}
									cache.put('/data', new Response(JSON.stringify(data)));
									//json.Result = null;
									return data;
								});
							}
						});
					});
				})]).then(function (jsons) {
					days = jsons[1].days;
					let cross = jsons[0].Result,
						base = jsons[1].base,
						keys = Object.keys(cross),
						colors = [
							[0.25, 1, 0.25, 0.75],
							[0.25, 0.25, 0.25, 0.75],
							[1, 0.25, 0.25, 0.75]
						],
						stats = {
							0: {
								data: Array(days.length).fill(0),
								colors: [colors[0]]
							},
							1: {
								data: Array(days.length).fill(0),
								colors: [colors[1]]
							},
							2: {
								data: Array(days.length).fill(0),
								colors: [colors[2]]
							}
						};
					keys.sort(function (a, b) {
						let aa = base[a],
							bb = base[b];
						return bb[bb.length - 1][2] - aa[aa.length - 1][2];
					});
					for (let i = 0; i < keys.length; i++) {
						let j = days.indexOf(cross[keys[i]][0]),
							d = base[keys[i]],
							lastd3;
						if (j >= 0) {
							allLines[keys[i]] = {
								data: [],
								cross: j - d[1],
								name: d[0],
								offset: d[1],
								colors: []
							};
							for (let k = 2; k < d.length; k++) {
								stats[d[k][3]].data[k + d[1] - 2]++;
								if (lastd3 !== d[k][3]) {
									lastd3 = d[k][3];
									allLines[keys[i]].colors[allLines[keys[i]].data.length] = colors[d[k][3]];
								}
								allLines[keys[i]].data.push(d[k][0] * d[k][1]);
								if (k === d.length - 1) {
									cs[d[k][3]][keys[i]] = true;
									allLines[keys[i]].color = translateColor(d[k][2]);
									allLines[keys[i]].rate = d[k][1];
								}
							}
						}
					}
					for (let i = 0; i < days.length; i++) {
						let all = stats[0].data[i] + stats[1].data[i] + stats[2].data[i];
						stats[0].data[i] /= all;
						stats[1].data[i] /= all;
						stats[2].data[i] /= all;
					}
					chart.clear();
					chart.setData(allLines);
					subchart.clear();
					subchart.setData(stats);
					show();
					kernel.hideLoading();
				});
			} else {
				show();
			}
		}
	};

	function show() {
		let visible = {};
		if (kernel.location.args.c >= 0 && kernel.location.args.c < cs.length) {
			for (let n in allLines) {
				visible[n] = cs[kernel.location.args.c][n];
			}
			subchart.selected = kernel.location.args.c;
			names = Object.keys(cs[kernel.location.args.c]);
		} else {
			for (let n in allLines) {
				visible[n] = true;
			}
			subchart.selected = undefined;
			names = Object.keys(allLines);
		}
		chart.setVisibility(visible);
		chart.cursor = chart.cross;
		chart.center();
		ctx.clearRect(0, 0, 1, ctx.canvas.height);
		ctx.canvas.height = names.length;
		for (let i = 0; i < names.length; i++) {
			ctx.fillStyle = allLines[names[i]].color;
			ctx.fillRect(0, i, 1, 1);
		}
		selectStock(0);
	}

	function translateColor(v) {
		return 'rgb(' + calc(v) + ',' + calc(1 - v) + ',' + calc(v > 0.5 ? 1 - v : v) + ')';

		function calc(n) {
			return Math.round(n * 255);
		}
	}

	function mousedown(evt) {
		if (evt.button === 0 && names.length) {
			ctx.canvas.removeEventListener('mousedown', mousedown);
			ctx.canvas.addEventListener('mousemove', move);
			document.addEventListener('mouseup', up);
			move(evt);
		}

		function move(evt) {
			if (evt.offsetY >= 0 && evt.offsetY <= ctx.canvas.offsetHeight) {
				selectStock(evt.offsetY);
			}
		}

		function up(evt) {
			if (evt.button === 0) {
				ctx.canvas.addEventListener('mousedown', mousedown);
				ctx.canvas.removeEventListener('mousemove', move);
				document.removeEventListener('mouseup', up);
			}
		}
	}

	function selectStock(y) {
		arr.style.top = 36.5 + y + 'px';
		chart.selected = names[Math.round((y / ctx.canvas.offsetHeight) * (names.length - 1))];
		name.innerHTML = allLines[chart.selected].name + '<span>' + chart.selected + '</span>';
		chart.onrangechange();
	}

	function tslDateToVal(v) {
		return Math.round(v * 86400000) - 2209190743000;
	}
});