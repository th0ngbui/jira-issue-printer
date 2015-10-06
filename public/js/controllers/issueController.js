angular.module('issueController', [])

	.controller('issueController', ['$scope','$http','Issues', function($scope, $http, Issues) {
		
		Issues.get()
			.success(function(data) {
				var issues = data.issues;
				var groups = [];
				var group = [];
				for (var i = 0; i < issues.length; i++) {
					if (i % 2 == 0) {
						group = [];
					};
					issues[i].rank = i+1;
					group.push(issues[i]);

					if (group.length > 1) {
						groups.push(group);
					} else if(group.length == 1 && i == issues.length-1) {
						groups.push(group);
					};

				};
				console.log(groups);
				$scope.groups = groups;
			});

	}]);