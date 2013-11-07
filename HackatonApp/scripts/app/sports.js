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

            subscribeForEvent: function () {
                var that = this,
                    user = app.everlive.Users.currentUser().then(function (data) {
                        Everlive.$.data("ActivitySubcribers").create(
                            {
                                "UserId": data.result.Id,
                                "ActivityId": that.Id
                            },
                            function () {
                                  debugger;  
                            },
                            function (data1, data2, data3) { 
                                debugger;
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
        sportsDataSource.read();
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
                      debugger;  
                },
                function (data1, data2, data3) { 
                    debugger;
                }
            );
        }
    };
    
})(window.app, jQuery);