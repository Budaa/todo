angular.module('toDo')

.service('userSrvc', ['$http', function($http){
	this.exist = function(email) {
		return $http.get('/api/user/register/' + email)
	}

	this.register = function(data) {
		return $http.post('/api/user/register', data)
	}
}])