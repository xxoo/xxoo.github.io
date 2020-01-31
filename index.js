window.addEventListener('load', function(){
	let url = 'https://dev.tinysoft.com.cn:8082/webapi/api2.tsl',
		list = document.getElementById('list');
	window.chart = new Chart(document.getElementById('chart'));
	list.addEventListener('keydown', function(evt) {
		let el;
		if (evt.keyCode === 38 || evt.keyCode === 40) {
			evt.preventDefault();
			if (chart.selected) {
				el = list.querySelector(`a[data-c="${chart.selected}"]`);
			}
			if (el) {
				if (evt.keyCode === 38) {
					el = el === list.firstChild ? list.lastChild : el.previousSibling;
				} else {
					el = el === list.lastChild ? list.firstChild : el.nextSibling;
				}
			} else {
				el = list.firstChild;
			}
			if (el) {
				el.scrollIntoView();
				el.click();
			}
		}
	});
	list.addEventListener('click', function (evt) {
		if (evt.target.nodeName === 'A') {
			if (chart.selected === evt.target.dataset.c) {
				chart.selected = undefined;
				evt.target.style.fontWeight = '';
			} else {
				let el = list.querySelector(`a[data-c="${chart.selected}"]`);
				if (el) {
					el.style.fontWeight = '';
				}
				evt.target.style.fontWeight = 'bold';
				chart.selected = evt.target.dataset.c;
			}
		}
	});
	let req = indexedDB.open('db');
	req.onupgradeneeded = function(evt) {
		evt.target.result.createObjectStore('close');
	};
	req.onsuccess = function(evt) {
		let db = evt.target.result;
		db.transaction('close', 'readonly').objectStore('close').openKeyCursor(null, 'prev').onsuccess = function(evt) {
			fetch(new Request(url, {
				method: 'post',
				body: 'ServiceID=Z001&param=[' + (evt.target.result ? evt.target.result.key : '') + ']'
			})).then(function(response) {
				return response.json();
			}).then(function(json) {
				let store = db.transaction('close', 'readwrite').objectStore('close');
				for (let i = 1; i < json.Result.length; i++) {
					let data = {};
					for (let j = 1; j < json.Result[i].length; j++) {
						if (json.Result[i][j] !== null) {
							data[json.Result[0][j]] = json.Result[i][j];
						}
					}
					store.put(data, json.Result[i][0]);
				}
				fetch(new Request(url, {
					method: 'post',
					body: 'ServiceID=Z002'
				})).then(function(response) {
					return response.json();
				}).then(function(json) {
					let cursors = json.Result,
						lines = {};
					let t = Date.now();
					db.transaction('close', 'readonly').objectStore('close').openCursor().onsuccess = function(evt) {
						let cur = evt.target.result;
						if (evt.target.result) {
							for (let n in cur.value) {
								if (cursors[n]) {
									if (!lines[n]) {
										lines[n] = {
											data: []
										};
									}
									if (cursors[n][0] === cur.key) {
										lines[n].cursor = lines[n].data.length;
									}
									lines[n].data.push(cur.value[n]);
								}
							}
							cur.continue();
						} else {
							console.log(Date.now() - t);
							chart.add(lines);
							chart.center();
							let s = '';
							for (let n in lines) {
								if (lines[n].hasOwnProperty('cursor')) {
									s += `<a data-c="${n}"${chart.selected === n ? ' style="font-weight:bold;"': ''}>${n}: ${cursors[n][1]}</a>`;
								}
							}
							list.innerHTML = s;
						}
					};
				});
			});
		};
	}
});