angular.module('toDo', [])

.controller('mainCtrl', ['$scope', 'testSrvc', function($scope, testSrvc) {
	$scope.todoError = []
	$scope.createTodo = function(todo){
		testSrvc.create({
			body: todo.body,
			username: 'pbuderaski',
		}).success(function(res){
			$scope.todos.push(res)
		}).error(function(err){
			$scope.todoError.push("There was a problem adding your post to the database and it wasn't saved")
		})
	}
	$scope.getTodos = function() {
		var user = {
			username: 'pbuderaski'
		}
		testSrvc.fetch(user)
			.success(function(data) {
				console.log(data)
				$scope.todos = data 
			}).error(function(err) {
				console.log(err)
				$scope.todoError.push("There was a problem getting your data")				
			})

	}
	$scope.getTodos()
	

	
}])

.service('testSrvc', ['$http', function($http){
	this.create = function(data) {
		return $http.post('/todo', data)
	}

	//TODO
	//change for better user verification 
	this.fetch = function(user) {
		return $http.get('/todo/' + user)
	}
}])