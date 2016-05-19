angular.module('toDo', [])

.controller('mainCtrl', ['$scope', 'todoSrvc', '$filter', function($scope, todoSrvc, $filter) {
	/**
	 * Function to trim whitespaces etc from edges of the string
	 * @return {[string]} [return trimed string]
	 */

	$scope.todoError = []


	/**
	 * Creating new Todo for user
	 * @param  {[json]} todo [body and username]
	 * @return {[type]}      [description]
	 */
	$scope.createTodo = function(todo){
		String.prototype.trim = function () {
	    	return this.replace(/^\s*/, "").replace(/\s*$/, "");
		}

		if( todo === undefined) {
			$.alert({
				title: "Error",
				content: "error!"
			})
		}
		todoSrvc.create({
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
		todoSrvc.fetch(user)
			.success(function(data) {
				$scope.todos = data 
			}).error(function(err) {
				$scope.todoError.push("There was a problem getting your data")				
			})
	}
	
	$scope.doneTodo = function(id, status) {
		todoSrvc.done({id: id})
			.success(function(data){
				for (var i=$scope.todos.length-1; i>=0; i--) {
    				if ($scope.todos[i]._id === data._id) {
	        			$scope.todos[i].done = !status
	        			break       
        			}
        		}
			}).error(function(err) {
				$scope.todoError.push("There was a problem setting todo as done")	
			})
	}

	$scope.deleteTodo = function(id) {
		todoSrvc.delete(id)
			.success(function(data) {
				for (var i=$scope.todos.length-1; i>=0; i--) {
    				if ($scope.todos[i]._id === id) {
	        			$scope.todos.splice(i, 1)
	        			break       
        			}
        		}
			}).error(function(err) {
				$scope.todoError.push("There was a problem deleting todo")
			})
	}

$scope.getTodos()
	
}])

.service('todoSrvc', ['$http', function($http){
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