var app = app || {};
app.places = (function(){
    
    var placesModel = (function () {
		var placeModel = {
			id: 'Id',
			fields: {
				Title: {
					field: 'Title',
					defaultValue: ''
				}
			},
			ImageUrl: function () {
				return app.helper.resolvePictureUrl(this.get('Image'));
			}
		};
        var ratingModel = {
            id: 'Id'
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
        var ratingsDataSource = new kendo.data.DataSource({
			type: 'everlive',
			schema: {
				model: ratingModel
			},
			transport: {
				// required by Everlive
				typeName: 'Rating'
			},
			sort: { field: 'CreatedAt', dir: 'desc' }
		});
		return {
            ratings: ratingsDataSource,
			places: placesDataSource
		};
	}());

	// places view model
	var placesViewModel = (function () {
		var placeSelected = function (e) {
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
				var place = placesModel.places.getByUid(e.view.params.uid);
                var query = new Everlive.Query();
                var data = app.everlive.data('Rating');
                data.get(query.where().eq('RatedItem', place.id).done()).then(function(dt){
                    var ratingTotal = 0;
                    if(dt.count && dt.count > 0)
                    {
                        var ratingSum = 0;
                        for(var i=0; i<dt.count; i++){
                            ratingSum += dt.result[i].Value;
                        }
                        ratingTotal = Math.round(ratingSum/dt.count);
                    }
                    
                     var viewModel = kendo.observable({
                            place: place,
                            rating: ratingTotal
                        });
                    kendo.bind(e.view.element, viewModel, kendo.mobile.ui);
                });
				
			}
		};
	}());
    
    var ratingLogic = {
        onSelect: function(e){
            var userId = app.viewModels.addActivity.me.data.Id;
            var value = parseInt(this.current().text());
            var data = app.everlive.data('Rating');
            var query = new Everlive.Query();
            var place = placesModel.places.getByUid(e.sender.view().params.uid);
            data.get(query.where().eq('CreatedBy', userId).done()).then(function(dt){
                if(!dt.count){
                    data.create({'Value': value, 'RatedItem' : place.Id}, function(succ){
                    alert("Successfully rated this item!");
                });
                }
                else{
                    data.update({'Value': value}, {'CreatedBy': userId}, function(dt){
                        alert("Successfully updated rating!");
                    });
                }
            });
            
        },
    };
    
    return {
        ratingLogic: ratingLogic,
        placesViewModel: placesViewModel,
        placeViewModel: placeViewModel
    };
}());