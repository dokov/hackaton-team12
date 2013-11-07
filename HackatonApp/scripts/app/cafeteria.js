var app = app || {};
app.cafeteria = (function(){
    'use strict';
    var todayMenu = (function () {
        var query = new Everlive.Query();
		var todayMenuItem = query.orderDesc('CreatedBy').take(1);
		return todayMenuItem;
	}());
    
    return {
		viewModels: {
			todayMenu: todayMenu
		}
	};
}());