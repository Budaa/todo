angular.module('toDo', [])

.controller('mainCtrl', ['$scope', 'testSrvc', '$filter', function($scope, testSrvc, $filter) {
	$scope.todoError = []

	/**
	 * Creating new Todo for user
	 * @param  {[json]} todo [body and username]
	 * @return {[type]}      [description]
	 */
	$scope.createTodo = function(todo){
		testSrvc.create({
			body: todo.body,
			username: 'pbuderaski',
		}).success(function(res){
			$scope.todos.push(res)
			$scope.todo.body = ""
		}).error(function(err){
			$scope.todoError.push("There was a problem adding your post to the database and it wasn't saved")
		})
	}
	$scope.getTodos = function() {
		var user = 'pbuderaski'
		testSrvc.fetch(user)
			.success(function(data) {
				$scope.todos = data 
			}).error(function(err) {
				$scope.todoError.push("There was a problem getting your data")				
			})
	}
	
	$scope.doneTodo = function(id) {
		testSrvc.done({id: id})
			.success(function(data){
				for (var i=$scope.todos.length-1; i>=0; i--) {
    				if ($scope.todos[i]._id === data._id) {
	        			$scope.todos[i].done = true
	        			break       
        			}
        		}
			}).error(function(err) {
				$scope.todoError.push("There was a problem setting todo as done")	
			})
	}

	$scope.deleteTodo = function(id) {
		testSrvc.delete(id)
			.success(function() {

			}).error(function(err) {

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

	this.done = function(id) {
		return $http.patch('/todo',  id)
	}

	this.delete = function(id) {
		return $http.delete('/todo/' + id)
	}
}])