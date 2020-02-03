'use strict';
define(['common/kernel/kernel'], function(kernel){
	return {
		ajax: function(o){
			kernel.showLoading();
			fetch(o.url, o.opt).then(function(response){
				return response.json();
			}).then(function(json){
				kernel.hideLoading();
				o.success(json);
			});
		}
	};
});