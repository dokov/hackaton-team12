(function (app, $, undefined) {
   
    var AppHelper = {
		resolveProfilePictureUrl: function (id) {
			if (id && id !== applicationSettings.emptyGuid) {
				return el.Files.getDownloadUrl(id);
			}
			else {
				return 'styles/images/avatar.png';
			}
		},
		resolvePictureUrl: function (id) {
			if (id && id !== applicationSettings.emptyGuid) {
				return el.Files.getDownloadUrl(id);
			}
			else {
				return '';
			}
		},
		formatDate: function (dateString) {
			var date = new Date(dateString);
			var year = date.getFullYear().toString();
			var month = date.getMonth().toString();
			var day = date.getDate().toString();
			return day + '.' + month + '.' + year;
		},
		logout: function () {
			return el.Users.logout();
		}
	};
    
    var sportsModel = (function () {
		var sportModel = {
			id: 'Id',
			fields: {
				SportName: {
					field: 'SportName',
					defaultValue: ''
				},
				UserId: {
					field: 'UserId',
					defaultValue: ''
				},
				Likes: {
					field: 'Likes',
					defaultValue: []
				}
			},
			CreatedAtFormatted: function () {
				return AppHelper.formatDate(this.get('CreatedAt'));
			},
			User: function () {
				var userId = this.get('UserId');
				var user = $.grep(usersModel.users(), function (e) {
					return e.Id === userId;
				})[0];
				return user ? {
					DisplayName: user.DisplayName,
					PictureUrl: AppHelper.resolveProfilePictureUrl(user.Picture)
				} : {
					DisplayName: 'Anonymous',
					PictureUrl: AppHelper.resolveProfilePictureUrl()
				};
			},
            changeFavorite: function (e) {
                var isChecked = e.checked,
                    sportId = e.data.id;
                app.everlive.Users.currentUser().then(function (data) {
                    if (isChecked) {
                         Everlive.$.data("FavoriteSports").create(
                            {
                                "SportId": sportId,
                                "UserId": data.result.Id
                            },
                            function () {
                                
                            },
                            function (data1, data2, data3) { 
                            }
                        );   
                    } else {
                        Everlive.$.data("FavoriteSports").destroy(
                            {
                                "SportId": sportId,
                                "UserId": data.result.Id
                            },
                            function () {
                            },
                            function (data1, data2, data3) { 
                            }
                        );   
                    }    
                });    
            }
		};
		var sportsDataSource = new kendo.data.DataSource({
			type: 'everlive',
			schema: {
				model: sportModel
			},
			transport: {
				// required by Everlive
				typeName: 'Sports'
			},
			change: function (e) {
				console.log("change");
			},
            error: function (e) {
                  console.log("error");
            },
            requestStart: function () {
                console.log("requrestStarted");
            },
			sort: { field: 'CreatedAt', dir: 'desc' }
		});
		return sportsDataSource;
	}());
    
    var eventsModel = (function () {
		var sportModel = {
			id: 'Id',
			fields: {
                ActivityId: {
                    field: "ActivityId",
                    defaultValue: ""
                },
				ActivityName: {
					field: 'ActivityName',
					defaultValue: ''
				},
                SportId: {
                  field: "SportId",
                    defaultValue: ''
                },
                Description: {
                    field: "Description",
                    defalutValue: ""
                },
                EventDateTime: {
                    field: "EventDateTime",
                    defalutValue: ""
                },
                SlotsAvailable: {
                    field: "SlotsAvailable",
                    defalutValue: ""
                },
				UserId: {
					field: 'UserId',
					defaultValue: ''
				},
				Likes: {
					field: 'Likes',
					defaultValue: []
				}
			},
            CouldSubscribe: function () {
                  return this.SlotsAvailable > 0;  
            },
            WhosPlayingHref: function () {
                  return "views/sports/whosplayingView.html?activityId=" + this.Id;  
            },
			CreatedAtFormatted: function () {
				return AppHelper.formatDate(this.get('CreatedAt'));
			},
			User: function () {
				var userId = this.get('UserId');
				var user = $.grep(usersModel.users(), function (e) {
					return e.Id === userId;
				})[0];
				return user ? {
					DisplayName: user.DisplayName,
					PictureUrl: AppHelper.resolveProfilePictureUrl(user.Picture)
				} : {
					DisplayName: 'Anonymous',
					PictureUrl: AppHelper.resolveProfilePictureUrl()
				};
			},

            subscribeForEvent: function (e) {
                var $view = $(e.sender.element).closest("[data-role='view']"),
                      that = this,
                    user = app.everlive.Users.currentUser().then(function (data) {
                        Everlive.$.data("ActivitySubcribers").create(
                            {
                                "UserId": data.result.Id,
                                "ActivityId": that.Id
                            },
                            function () {
                                
                            },
                            function (data1, data2, data3) { 
                                
                            }
                        );
                        var slotsAvailable = parseInt(that.SlotsAvailable) - 1;
                        Everlive.$.data("Activities").updateSingle({ Id: that.Id, SlotsAvailable: slotsAvailable },
                            function(data){
                                app.viewModels.sports.favoriteEventShow({
                                   view: {
                                       element: $view.get(0)
                                   } 
                                });
                            },
                            function(error){
                            }
                        );
                        
                    });
            }
		};
		var sportsDataSource = new kendo.data.DataSource({
			type: 'everlive',
			schema: {
				model: sportModel
			},
			transport: {
				// required by Everlive
				typeName: 'Activities'
			},
			change: function (e) {
				console.log("change");
			},
            error: function (e) {
                  console.log("error");
            },
            requestStart: function () {
                console.log("requrestStarted");
            },
			sort: { field: 'CreatedAt', dir: 'desc' }
		});
		return sportsDataSource;
	}());
    
    var newEventModel = (function () {
		var sportModel = {
			id: 'Id',
			fields: {
				SportName: {
					field: 'SportName',
					defaultValue: ''
				},
                IsFavorite: false,
				UserId: {
					field: 'UserId',
					defaultValue: ''
				},
				Likes: {
					field: 'Likes',
					defaultValue: []
				}
			},
			CreatedAtFormatted: function () {
				return AppHelper.formatDate(this.get('CreatedAt'));
			},
			User: function () {
				var userId = this.get('UserId');
				var user = $.grep(usersModel.users(), function (e) {
					return e.Id === userId;
				})[0];
				return user ? {
					DisplayName: user.DisplayName,
					PictureUrl: AppHelper.resolveProfilePictureUrl(user.Picture)
				} : {
					DisplayName: 'Anonymous',
					PictureUrl: AppHelper.resolveProfilePictureUrl()
				};
			},
            changeFavorite: function (e) {
                var isChecked = e.checked;
            }
		};
		var sportsDataSource = new kendo.data.DataSource({
			type: 'everlive',
			schema: {
				model: sportModel
			},
			transport: {
				// required by Everlive
				typeName: 'Sports'
			},
			change: function (e) {
				
			},
            error: function (e) {
                  console.log("error");
            },
            requestStart: function () {
                console.log("requrestStarted");
            },
			sort: { field: 'CreatedAt', dir: 'desc' }
		});
		return sportsDataSource;
	}());
    
    app.viewModels.sportActivities = {
    };
    
    app.viewModels.sports = {
        sports: sportsModel,
        events: eventsModel,
        newEventSports: [],
        newEvent: {
            show: function (e) {
                sportsModel.bind("change", function () {
                    app.viewModels.newEventSports = sportsModel.data();
                    kendo.bind($(e.view.element).find("#sports").parent().get(0), app.viewModels, kendo.mobile.ui);
                });
                sportsModel.read();
            }
        },
        createEvent: function (e) {
            var that = this,
                $element = $(e.event.target).closest("#activities-listview"),
                sportId = $element.find("#sports").val(),
                name = $element.find("#name").val(),
                dateTime = new Date($element.find("#dateTime").val()),
                description = $element.find("#description").val(),
                availableSlots = parseInt($element.find("#availableSlots").val());
            
                if (isNaN(dateTime.getTime())) {
                    dateTime = new Date();
                }
             Everlive.$.data("Activities").create(
                {
                    "SportId": sportId,
                    "ActivityName": name,
                    "EventDateTime": dateTime,
                    "Description": description,
                    "SlotsAvailable": availableSlots
                },
                function () {
                      
                },
                function (data1, data2, data3) { 
                  
                }
            );
        },
        sportsViewShow: function (e) {
            var element = e.view.element;
            sportsModel.bind("change", function  (e) {
                var items = e.items;
                Everlive.$.data('FavoriteSports').get()
                .then(function (data) {
                    var favoriteSports = data.result;
                    app.everlive.Users.currentUser().then(function (currentUser) {
                        currentUser = currentUser.result;
                        for (var i = 0; i < favoriteSports.length; i++) {
                            if (currentUser.Id == favoriteSports[i].UserId) {
                                for (var j = 0; j < items.length; j++) {
                                    if (items[j].Id == favoriteSports[i].SportId) {
                                        items[j].IsFavorite = true;
                                    }
                                }
                            }
                        }
                        kendo.bind(element, { sports: items }, kendo.mobile.ui);
                        sportsModel.unbind("change");
                    });
                });
            });
            sportsModel.read();
        },
        favoriteEventShow: function (e) {
            var element = e.view.element;
            eventsModel.bind("change", function (e) {
               var items = e.items;
                Everlive.$.data('FavoriteSports').get()
                .then(function (data) {
                    var favoriteSports = data.result;
                    app.everlive.Users.currentUser().then(function (currentUser) {
                        currentUser = currentUser.result;
                        for (var i = 0; i < favoriteSports.length; i++) {
                            if (currentUser.Id == favoriteSports[i].UserId) {
                                for (var j = 0; j < items.length; j++) {
                                    if (items[j].SportId == favoriteSports[i].SportId) {
                                        if (items.splice(j, 1).length > 0) {
                                            j--;    
                                        }
                                    }
                                }
                            }
                        }
                        kendo.bind(element, { events: items }, kendo.mobile.ui);
                        eventsModel.unbind("change");
                    });
                });
            });
            eventsModel.read();
        },
        onWhosPlayingShow: function (e) {
            var activityId = e.view.params.activityId,
                element = e.view.element;
            var model = {
              title: "Who's Playing"  ,
                users: []
            };
            Everlive.$.data('ActivitySubcribers').get()
                .then(function (data) {
                    var subscribers = data.result;
                    Everlive.$.data('Users').get()
                    .then(function (data) {
                        var users = data.result;
                        for (var i = 0; i < subscribers.length; i++) {
                            if (subscribers[i].ActivityId == activityId) {
                                model.users.push(getUser(users, subscribers[i].UserId));
                                
                            }
                        }
                        kendo.bind(element, model, kendo.mobile.ui);
                    });
                });
            
        }
    };
    
    function getUser(users, userId) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].Id == userId) {
                return users[i];
            }
        }
    }
    
})(window.app, jQuery);