appControllers.controller('PostListCtrl', ['$scope', '$http', '$location', '$sce', 'PostService',
	function PostListCtrl($scope, $http, $location, $sce, PostService) {

		$scope.posts = [];

		PostService.findAll().success(function(data) {
			for (var postKey in data) {
				data[postKey].content = $sce.trustAsHtml(data[postKey].content);
			}

			$scope.posts = data;			
		}).error(function(data, status) {
			console.log(status);
			console.log(data);
		});
	}
]);

appControllers.controller('PostViewCtrl', ['$scope', '$routeParams', '$http', '$location', '$sce', 'PostService',
	function PostViewCtrl($scope, $routeParams, $http, $location, $sce, PostService) {

		$scope.post = {};
		var post_url = $routeParams.postUrl;

		PostService.read(post_url).success(function(data) {
			data.content = $sce.trustAsHtml(data.content);
			$scope.post = data;
		}).error(function(data, status) {
			console.log(status);
			console.log(data);
		});
	}
]);


appControllers.controller('AdminPostListCtrl', ['$scope', '$http', '$location', '$timeout', 'PostService', 
	function AdminPostListCtrl($scope, $http, $location, $timeout, PostService) {

		$scope.posts = [];

		//Get id, title, date_created, is_published, number of Read
		PostService.findAll().success(function(data) {
			$scope.posts = data;
		});

		$scope.updatePublishState = function updatePublishState(post, shouldPublish) {
			if (post !== undefined && shouldPublish !== undefined) {

				PostService.changePublishState(post._id, shouldPublish).success(function(data) {
					var posts = $scope.posts;
					for (var postKey in posts) {
			    		if (posts[postKey]._id == post._id) {
			    			$scope.posts[postKey].is_published = shouldPublish;
			    			return ;
			    		}
		    		}
				}).error(function(status, data) {
					console.log(status);
					console.log(data);
				});
			}
		}


		$scope.deletePost = function deletePost(post) {
			if (post != undefined) {

				PostService.delete(post._id).success(function(data) {
					var posts = $scope.posts;
					for (var postKey in posts) {
			    		if (posts[postKey]._id == post._id) {
			    			$scope.posts.splice(postKey, 1);
			    			return ;
			    		}
		    		}
				}).error(function(status, data) {
					console.log(status);
					console.log(data);
				});
			}
		}
	}
]);

appControllers.controller('AdminPostCreateCtrl', ['$scope', '$http', '$location', 'PostService',
	function AdminPostCreateCtrl($scope, $http, $location, PostService) {

		$scope.message = {is_error: false, is_success: false, message: ""};
		$('#textareaContent').wysihtml5({"font-styles": false});

		$scope.save = function save(post, shouldPublish) {
			if (post !== undefined 
				&& post.title !== undefined 
				&& post.url !== undefined
				&& post.tags != undefined) {

				var content = $('#textareaContent').val();
				if (content !== undefined) {
					post.content = content;

					if (shouldPublish !== undefined && shouldPublish == true) {
						post.is_published = true;
					} else {
						post.is_published = false;
					}

					PostService.create(post).success(function(data) {
						$location.path("/admin");
					}).error(function(status, data) {
						console.log(status);
						console.log(data);
					});
				}
			}
		}
	}
]);

appControllers.controller('AdminPostEditCtrl', ['$scope', '$routeParams', '$http', '$location', '$sce', 'PostService',
	function AdminPostEditCtrl($scope, $routeParams, $http, $location, $sce, PostService) {

		$scope.message = {is_error: false, is_success: false, message: ""};

		$scope.post = {};
		var postUrl = $routeParams.postUrl;

		PostService.read(postUrl).success(function(data) {
			$scope.post = data;
			$('#textareaContent').wysihtml5({"font-styles": false});
			$('#textareaContent').val($sce.trustAsHtml(data.content));
		}).error(function(status, data) {
			$location.path("/admin");
		});

		$scope.save = function save(post, shouldPublish) {
			console.log(post);
			if (post !== undefined 
				&& post.title !== undefined && post.title != "" 
				&& post.url !== undefined && post.url != "") {

				var content = $('#textareaContent').val();
				if (content !== undefined && content != "") {
					post.content = content;

					if (shouldPublish != undefined && shouldPublish == true) {
						post.is_published = true;
					} else {
						post.is_published = false;
					}

					// string comma separated to array
					if (Object.prototype.toString.call(post.tags) !== '[object Array]') {
						post.tags = post.tags.split(',');
					}
					
					PostService.update(post).success(function(data) {
						$location.path("/admin");
					}).error(function(status, data) {
						console.log(status);
						console.log(data);
					});
				}
			}
		}
	}
]);

appControllers.controller('AdminUserCtrl', ['$scope', '$http', '$location', 'AuthenticationService', 
	function AdminUserCtrl($scope, $http, $location, AuthenticationService) {

		//Admin User Controller (login, logout)
		$scope.logIn = function logIn(username, password) {
			if (username !== undefined && password !== undefined) {

				$http.post(options.api.base_url + '/login', {username: username, password: password}, {withCredentials: true}).success(function(data) {
					AuthenticationService.isLogged = true;
					$location.path("/admin");
				}).error(function(status, data) {
					console.log(status);
					console.log(data);
				});
			}
		}

		$scope.logout = function logout() {
			if (AuthenticationService.isLogged) {
				AuthenticationService.isLogged = false;
				$location.path("/");
			}
		}
	}
]);


appControllers.controller('PostListTagCtrl', ['$scope', '$routeParams', '$http', '$location', '$sce', 'PostService',
	function PostListTagCtrl($scope, $routeParams, $http, $location, $sce, PostService) {

		$scope.posts = [];
		var tagName = $routeParams.tagName;

		PostService.findByTag(tagName).success(function(data) {
			for (var postKey in data) {
				data[postKey].content = $sce.trustAsHtml(data[postKey].content);
			}
			$scope.posts = data;
		}).error(function(status, data) {
			console.log(status);
			console.log(data);
		});

	}
]);

