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
    
    var activitiesModel = (function () {
		var activityModel = {
			id: 'Id',
			fields: {
				Text: {
					field: 'Text',
					defaultValue: ''
				},
				CreatedAt: {
					field: 'CreatedAt',
					defaultValue: new Date()
				},
				Picture: {
					fields: 'Picture',
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
			PictureUrl: function () {
				return AppHelper.resolvePictureUrl(this.get('Picture'));
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
		var activitiesDataSource = new kendo.data.DataSource({
			type: 'everlive',
			schema: {
				model: activityModel
			},
			transport: {
				// required by Everlive
				typeName: 'Activities'
			},
			change: function (e) {
				if (e.items && e.items.length > 0) {
					$('#no-activities-span').hide();
				}
				else {
					$('#no-activities-span').show();
				}
			},
			sort: { field: 'CreatedAt', dir: 'desc' }
		});
		return {
			activities: activitiesDataSource
		};
	}());
    
    var activitiesViewModel = (function () {
		var activitySelected = function (e) {
			mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
		};
		var navigateHome = function () {
			mobileApp.navigate('#welcome');
		};
		var logout = function () {
			AppHelper.logout()
			.then(navigateHome, function (err) {
				showError(err.message);
				navigateHome();
			});
		};
		return {
			activities: activitiesModel.activities,
			activitySelected: activitySelected,
			logout: logout
		};
	}());

	return {
		viewModels: {
			login: loginViewModel,
			signup: singupViewModel,
			activities: activitiesViewModel,
			activity: activityViewModel,
			addActivity: addActivityViewModel
		}
	};
    
    app.viewModels.sports = {
        showActivities: function () {
            
        }
    };
    
})(window.app, jQuery);