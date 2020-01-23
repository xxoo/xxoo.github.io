window.addEventListener('load', function(){
	fetch(new Request('http://dev.tinysoft.com.cn:8082/webapi/api2.tsl', {
		method: 'post',
		body: 'ServiceID=Z001&TaskID=&param=[%22SZ000001;SZ000002%22]'
	})).then(function(response) {
    return response.json();
  }, function(err){
		console.log(err);
	}).then(function(myJson) {
    console.log(myJson);
  });
});