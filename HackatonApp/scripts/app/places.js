var app = app || {};
app.places = (function(){
    
    var placesModel = (function () {
		var placeModel = {
			id: 'Id',
			fields: {
				Title: {
					field: 'Title',
					defaultValue: ''
				},
                Address: {
					field: 'Address',
					defaultValue: ''
				}
			},
			ImageUrl: function () {
				return app.helper.resolvePictureUrl(this.get('Image'));
			}
		};
		var placesDataSource = new kendo.data.DataSource({
			type: 'everlive',
			schema: {
				model: placeModel
			},
			transport: {
				// required by Everlive
				typeName: 'Places'
			},
			sort: { field: 'CreatedAt', dir: 'desc' }
		});
		return {
			places: placesDataSource
		};
	}());

	// places view model
	var placesViewModel = (function () {
		var placeSelected = function (e) {
            debugger;
			app.mobileApp.navigate('views/Places/placeView.html?uid=' + e.data.uid);
		};
		return {
			places: placesModel.places,
			placeSelected: placeSelected
		};
	}());
    
    var placeViewModel = (function () {
		return {
			show: function (e) {
                debugger;
				var place = placesModel.places.getByUid(e.view.params.uid);
				kendo.bind(e.view.element, place, kendo.mobile.ui);
			}
		};
	}());
    
    return {
        placesViewModel: placesViewModel,
        placeViewModel: placeViewModel
    };
}());