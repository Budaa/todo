angular.module('toDo')

.service('userSrvc', ['$http', function($http){
	var svc = this
	svc.exist = function(email) {
		return $http.get('/api/user/register/' + email)
	}

	svc.login = function(data) {
		return $http.post('/api/user/login', data)
			.then(function(token) {	
				return svc.startSession(token.data)
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

	svc.startSession = function(token, remember = true) {
		$http.defaults.headers.common['X-Auth'] = token
		if(remember){
			window.localStorage.token = token
		}
		return svc.getUser()
			.then(function(data){
				return data
			})
	}

	svc.getStats = function(email){
		return $http.get('/api/user/stat/' + email)
	}
}])