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
		return {
			sports: sportsDataSource
		};
	}());
    
    app.viewModels.sportActivities = {
    };
    
    app.viewModels.sports = {
        sports: sportsModel,
        name: "Sports",
        activitySelected: $.noop,
		logout: $.noop
    };
    
})(window.app, jQuery);