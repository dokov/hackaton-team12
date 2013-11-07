var app = app || {};
app.cafeteria = (function(){
    'use strict';
    var todayMenu = {
            show: function (e) {
				 var query = new Everlive.Query();
                 var data = app.everlive.data('Menu');
                 data.get(query.orderDesc('MenuDate').take(1)).then(function(data){
                        var date = new Date(data.result[0].MenuDate);
                        var formattedDate = date.getMonth() + 1 + '/' + date.getDate() + '/' +  date.getFullYear()
                        var viewModel = kendo.observable({
                            menuItem: data.result[0],
                            formattedDate: formattedDate
                        });
                        kendo.bind(e.view.element, viewModel, kendo.mobile.ui);
                 });
				
			}
        };
    
    return {
		viewModels: {
			todayMenu: todayMenu
		}
	};
}());