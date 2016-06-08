
angular.module('toDo')
.controller('TodosCtrl', ['$scope', 'todoSrvc', '$filter', function($scope, todoSrvc, $filter) {

	/**
	 * Error loger. Please format messeges for user output
	 * @type {Array}
	 */
	$scope.todoError = []



	/**
	 * Creating new Todo for user
	 * @param  {[json]} todo [body and username]
	 * @return {[type]}      [Error message or seting $scope.body to null and pushing new todo to view]
	 */
	$scope.createTodo = function(todo){
		/**
		 * Function to trim whitespaces  from edges of the string
		 * @return {[string]} [return trimed string]
		 */
		String.prototype.trim = function () {
	    	return this.replace(/^\s*/, "").replace(/\s*$/, "");
		}
		if( todo === undefined || todo.body === "" || todo.body === undefined) {
			$scope.todoError.push("Todo can not be empty!")
			return false
		}
		if (todo) {
			todo.body.trim()
		}


		todo.until = parseInt(todo.until, 10)

		todoSrvc.create({
			body: todo.body,
			username: $scope.currentUser.email,
			until: todo.until
		}).success(function(res){
			$scope.todos.push(res)
			$scope.todo.body = ""
		}).error(function(err){
			$scope.todoError.push("There was a problem adding your post to the database and it wasn't saved")
		})
	}


	$scope.getTodos = function() {
		var user = $scope.currentUser.email
		todoSrvc.fetch(user)
			.success(function(data) {
				$scope.todos = data 
			}).error(function(err) {
				$scope.todoError.push("There was a problem getting your data")				
			})
	}
	
	$scope.when = function(num, done) {
		if(done) {
			return "Done"
		}
		switch(num) {
			case 0:
				return "Today"
				break
			case 1:
				return "Tomorrow"
				break
			case 2:
				return "This week"
				break
			case 3:
				return "Some day"
				break
			default:
				return "Error occured"
		}
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


	//Variables for daySeparator
	$scope.isDisplayed = {
		0: false,
		1: false,
		2: false,
		3: false,
		4: false
	}
	$scope.howManyTimesInvoked = 0
	// return true if day separatot shoud be displayed
	$scope.daySeparator = function(day, done) {
		if($scope.howManyTimesInvoked > $scope.todos.length-1){
			$scope.isDisplayed[0] = false
			$scope.isDisplayed[1] = false
			$scope.isDisplayed[2] = false
			$scope.isDisplayed[3] = false
			$scope.isDisplayed[4] = false
			$scope.howManyTimesInvoked = 0
		}
		if(done) {
			if(!$scope.isDisplayed[4]){
				$scope.isDisplayed[4] = true
				$scope.howManyTimesInvoked++
				return true
			}
			$scope.howManyTimesInvoked++
			return false
		}
		if(!$scope.isDisplayed[day]) {
			$scope.isDisplayed[day] = true
			$scope.howManyTimesInvoked++
			return true
		}
		$scope.howManyTimesInvoked++
		return false
	}


	if(!$scope.currentUser){
		$scope.todoError.push('Please log in to see this section')
	}else {
		$scope.getTodos()
	}
}])