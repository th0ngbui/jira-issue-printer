angular.module('issueService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Issues', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/jira-issues');
			}
		}
	}]);