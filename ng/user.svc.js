angular.module('toDo')

.service('userSrvc', ['$http', function($http){
	this.exist = function(email) {
		return $http.get('/api/user/register/' + email)
	}

	this.login = function(data) {
		return $http.post('/api/session/login', data)
	}

	this.register = function(data) {
		return $http.post('/api/user/register', data)
	}
}])