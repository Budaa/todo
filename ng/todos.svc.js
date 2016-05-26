angular.module('toDo')
.service('todoSrvc', ['$http', function($http){
	this.create = function(data) {
		return $http.post('/api/todo', data)
	}

	//TODO
	//change for better user verification 
	this.fetch = function(user) {
		return $http.get('/api/todo/' + user)
	}

	this.done = function(id) {
		return $http.patch('/api/todo',  id)
	}

	this.delete = function(id) {
		return $http.delete('/api/todo/' + id)
	}
}])