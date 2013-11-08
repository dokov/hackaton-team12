var app = app || {};
app.places = (function(){
    var currentPlace;
    var $boundElement;
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
    
    var ratingLogic = {
        onSelect: function(e){
            var userId = app.viewModels.addActivity.me.data.Id,
            value = parseInt(this.current().text()),
            data = app.everlive.data('Rating'),
            query = new Everlive.Query(),
            place = placesModel.places.getByUid(e.sender.view().params.uid);
            calculateRating = function(dt){
                    var ratingTotal = 0;
                    
                    if(dt.count && dt.count > 0)
                    {
                        var ratingSum = 0;
                        for(var i=0; i<dt.count; i++){
                            ratingSum += dt.result[i].Value;
                        }
                        ratingTotal = Math.round(ratingSum/dt.count);
                    }
                    return ratingTotal;
            },
            
            data.get(query.where().eq('CreatedBy', userId).eq('RatedItem', place.id).done()).then(function(dt){
                if(!dt.count){
                    data.create({'Value': value, 'RatedItem' : place.Id}, function(succ){
                     var query = new Everlive.Query();
                     data.get(query.where().eq('RatedItem', place.id).done()).then(function(dt){
                         var totalRating = calculateRating(dt);
                         place.set("Rating", totalRating);
                         placesModel.places.sync();
                    }); 
                });
                }
                else{
                    data.update({'Value': value}, {'CreatedBy': userId}, function(dt){
                        var query = new Everlive.Query();
                        data.get(query.where().eq('RatedItem', place.id).done()).then(function(dt){
                         var totalRating = calculateRating(dt);
                         place.set("Rating", totalRating);
                         placesModel.places.sync();
                    });
                        
                    });
                }
            });
            
        },
    };
    
    var commentsLogic = {
        createComment: function(e){
            var data = app.everlive.data('Comment'),
            commentVal = $boundElement.find("#myComment").val();
            var query = new Everlive.Query();
            data.create({'Content' : commentVal, 'CommentedItem' : currentPlace.id}, function(succ){
                data.get(query.where().eq('CommentedItem', currentPlace.id).done().orderDesc('CreatedAt')).then(function(dt){
                    var viewModel = kendo.observable({
                        commentsLogic: commentsLogic,
                        comments: dt.result,
                        place: currentPlace,
                    });
                    kendo.bind($boundElement, viewModel, kendo.mobile.ui);
                });
            });
        }
    };
    
    var placeViewModel = (function () {
		return {
			show: function (e) {
				var place = placesModel.places.getByUid(e.view.params.uid);
                var data = app.everlive.data('Comment');
                var query = new Everlive.Query(); 
                $boundElement = e.view.element;
                currentPlace = place;
                $("#submitCommentButton").unbind("click");
                $("#submitCommentButton").click(commentsLogic.createComment);
                data.get(query.where().eq('CommentedItem', place.id).done().orderDesc('CreatedAt')).then(function(dt){
                    var viewModel = kendo.observable({
                        commentsLogic: commentsLogic,
                        comments: dt.result,
                        place: place,
                    });
                    kendo.bind(e.view.element, viewModel, kendo.mobile.ui);
                });
			}
		};
	}());
    
    return {
        commentsLogic: commentsLogic,
        ratingLogic: ratingLogic,
        placesViewModel: placesViewModel,
        placeViewModel: placeViewModel
    };
}());