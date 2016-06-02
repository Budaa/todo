angular.module('toDo')

.service('userSrvc', ['$http', function($http){
	var svc = this
	svc.exist = function(email) {
		return $http.get('/api/user/register/' + email)
	}

	svc.login = function(data) {
		return $http.post('/api/user/login', data)
			.then(function(token) {
				$http.defaults.headers.common['X-Auth'] = token.data
				return svc.getUser()
			})
	}

	svc.logout = function(){
		$http.defaults.headers.common['X-Auth'] = ''
		return true
	}

	svc.getUser = function() {
		return $http.get('/api/user')
	}

	svc.register = function(data) {
		return $http.post('/api/user/register', data)
	}

	svc.startSession = function(token) {
	}
}])